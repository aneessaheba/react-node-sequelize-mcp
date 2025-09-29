

from __future__ import annotations

from typing import Annotated, Any

import httpx
from mcp.server.fastmcp import FastMCP
from mcp.server.fastmcp.exceptions import ToolError

mcp = FastMCP("mealdb")

API_BASE_URL = "https://www.themealdb.com/api/json/v1/1"
REQUEST_TIMEOUT = 10.0  # seconds


async def _get(endpoint: str, params: dict[str, Any] | None = None) -> dict[str, Any]:
    """Perform a GET request against TheMealDB and return the parsed JSON body."""

    url = f"{API_BASE_URL}/{endpoint}"
    try:
        async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
    except httpx.HTTPStatusError as exc:  # pragma: no cover - runtime protection
        raise ToolError(
            f"TheMealDB returned status {exc.response.status_code} for {endpoint}."
        ) from exc
    except httpx.RequestError as exc:  # pragma: no cover - runtime protection
        raise ToolError(f"Network error while contacting TheMealDB: {exc}") from exc

    data = response.json()
    if not isinstance(data, dict):  # pragma: no cover - defensive guard
        raise ToolError("Unexpected response payload from TheMealDB.")
    return data


def _summarize_meal(meal: dict[str, Any]) -> dict[str, Any]:
    """Return the subset of fields we want to expose for list-style responses."""

    instructions = (meal.get("strInstructions") or "").strip()
    truncated = instructions[:280] + ("…" if len(instructions) > 280 else "")
    tags = [tag.strip() for tag in (meal.get("strTags") or "").split(",") if tag.strip()]

    return {
        "id": meal.get("idMeal"),
        "name": meal.get("strMeal"),
        "category": meal.get("strCategory"),
        "area": meal.get("strArea"),
        "tags": tags,
        "thumbnail": meal.get("strMealThumb"),
        "instructions_preview": truncated,
        "source_url": meal.get("strSource"),
        "youtube_url": meal.get("strYoutube"),
    }


def _extract_ingredients(meal: dict[str, Any]) -> list[dict[str, str]]:
    """Collect ingredient/measure pairs from the MealDB record."""

    ingredients: list[dict[str, str]] = []
    for index in range(1, 21):
        ingredient = (meal.get(f"strIngredient{index}") or "").strip()
        measure = (meal.get(f"strMeasure{index}") or "").strip()
        if ingredient:
            entry = {"ingredient": ingredient}
            if measure:
                entry["measure"] = measure
            ingredients.append(entry)
    return ingredients


def _format_full_meal(meal: dict[str, Any]) -> dict[str, Any]:
    """Return the canonical schema for detailed meal responses."""

    return {
        "id": meal.get("idMeal"),
        "name": meal.get("strMeal"),
        "category": meal.get("strCategory"),
        "area": meal.get("strArea"),
        "instructions": (meal.get("strInstructions") or "").strip(),
        "thumbnail": meal.get("strMealThumb"),
        "tags": [tag.strip() for tag in (meal.get("strTags") or "").split(",") if tag.strip()],
        "ingredients": _extract_ingredients(meal),
        "source_url": meal.get("strSource"),
        "youtube_url": meal.get("strYoutube"),
    }


@mcp.tool(
    "search_meals_by_name",
    description=(
        "Search meals by full or partial name. Returns a rich summary for each matching meal,"
        " including category, area, tags, and preview text."
    ),
)
async def search_meals_by_name(
    name: Annotated[str, "Meal name or substring to search for."],
) -> dict[str, Any]:
    query = name.strip()
    if not query:
        raise ToolError("Please provide a non-empty meal name or substring.")

    payload = await _get("search.php", {"s": query})
    meals = payload.get("meals") or []
    summaries = [_summarize_meal(meal) for meal in meals]
    return {"query": query, "count": len(summaries), "meals": summaries}


@mcp.tool(
    "filter_meals_by_ingredient",
    description=(
        "List meals that include a given main ingredient. The response contains meal IDs so"
        " clients can request full details with another tool."
    ),
)
async def filter_meals_by_ingredient(
    ingredient: Annotated[str, "Ingredient name to filter by (e.g., 'chicken')."],
) -> dict[str, Any]:
    term = ingredient.strip()
    if not term:
        raise ToolError("Please provide a non-empty ingredient value.")

    payload = await _get("filter.php", {"i": term})
    meals = payload.get("meals") or []
    results = [
        {
            "id": meal.get("idMeal"),
            "name": meal.get("strMeal"),
            "thumbnail": meal.get("strMealThumb"),
        }
        for meal in meals
    ]
    return {"ingredient": term, "count": len(results), "meals": results}


@mcp.tool(
    "lookup_meal_details",
    description="Fetch the full recipe details for a specific meal ID.",
)
async def lookup_meal_details(
    meal_id: Annotated[str, "TheMealDB ID for the meal (e.g., '52772')."],
) -> dict[str, Any]:
    identifier = meal_id.strip()
    if not identifier:
        raise ToolError("Please supply a valid meal ID.")

    payload = await _get("lookup.php", {"i": identifier})
    meals = payload.get("meals") or []
    if not meals:
        raise ToolError(f"Meal with ID {identifier} was not found in TheMealDB.")

    return _format_full_meal(meals[0])


@mcp.tool(
    "random_meal",
    description="Retrieve a single random meal from TheMealDB.",
)
async def random_meal() -> dict[str, Any]:
    payload = await _get("random.php")
    meals = payload.get("meals") or []
    if not meals:  # pragma: no cover - defensive guard
        raise ToolError("TheMealDB did not return a random meal.")
    return _format_full_meal(meals[0])


def main() -> None:
    """Entry point for running the MCP server."""

    mcp.run()


if __name__ == "__main__":
    main()
