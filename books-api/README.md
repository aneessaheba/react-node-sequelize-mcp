# Data-236 Homework 4 Starter

This workspace contains both the React front end and the Node.js + MySQL (Sequelize) back end needed for Homework 4. Use it as a baseline and capture the requested screenshots for your PDF deliverable.

## Folder Layout

- `client/` – React Book Management SPA (Q1)
- `server/` – Express + Sequelize REST API with MySQL integration (Q2)

## 1. React Book Management App (client)

```bash
cd client
npm install
npm run dev
```

### Configure the API client

The React app now uses Axios to talk to the backend instead of local component state. Create a `.env` file inside `client/` with the API base URL if you need to override the default:

```
VITE_API_BASE_URL=http://localhost:4000/api
```

If the variable is omitted, the app defaults to `http://localhost:4000/api`.

### Available routes

- `/` – `Home.jsx` lists all books and shows loading/errors coming from the API
- `/create` – `CreateBook.jsx` calls `POST /api/books` and redirects home once the record is stored
- `/update` – `UpdateBook.jsx` pulls the latest books, lets you edit a record, and hits `PUT /api/books/:id`
- `/delete` – `DeleteBook.jsx` issues `DELETE /api/books/:id` and returns to the catalog

Each component surfaces inline status and error feedback sourced from the Axios calls so the state stays in sync with the database.

## 2. Node + MySQL CRUD API (server)

### Install and configure

1. Create the database:
   ```sql
   CREATE DATABASE book_db;
   USE book_db;
   ```
2. Copy `server/.env.example` to `server/.env` and set your MySQL credentials.
3. Install dependencies and start the API:
   ```bash
   cd server
   npm install
   npm run dev
   ```

The API starts on `http://localhost:4000` by default and syncs the `books` table automatically. Set `SHOULD_SYNC_SCHEMA=false` in `.env` once the schema exists to avoid unintended alterations.

### REST endpoints (all return JSON)

| Method | Path             | Description                  |
| ------ | ---------------- | ---------------------------- |
| GET    | `/api/books`     | List all books               |
| GET    | `/api/books/:id` | Retrieve a single book       |
| POST   | `/api/books`     | Create a new book            |
| PUT    | `/api/books/:id` | Update title and author      |
| DELETE | `/api/books/:id` | Remove a book (204 on success)|

Each handler is implemented in `server/src/controllers/book.controller.js` and interacts with MySQL through Sequelize.

## Suggested Verification Steps

- Start the API first, then launch the React dev server so the Axios calls succeed.
- Run `npm run lint` in both `client` and `server` once packages are installed.
- Use Postman or curl to test every API endpoint (capture request/response screenshots).
- In the React UI, add/update/delete books and capture the before/after states for the submission.

## Next Steps for Submission

1. Gather all required screenshots (components + output, Postman calls, database view, project tree).
2. Compile them into `{last_name}_HW4.pdf`.
3. Submit the PDF according to course instructions.
