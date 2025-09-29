import { useCallback, useEffect, useMemo, useState } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import CreateBook from './components/CreateBook.jsx';
import DeleteBook from './components/DeleteBook.jsx';
import Home from './components/Home.jsx';
import UpdateBook from './components/UpdateBook.jsx';
import api, { BOOKS_ENDPOINT } from './lib/api.js';

function App() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(BOOKS_ENDPOINT);
      setBooks(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError('Failed to load books. Please try again.');
      // eslint-disable-next-line no-console
      console.error('Failed to fetch books', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleAdd = useCallback(
    async (title, author) => {
      await api.post(BOOKS_ENDPOINT, { title, author });
      await fetchBooks();
    },
    [fetchBooks],
  );

  const handleUpdate = useCallback(
    async (id, title, author) => {
      await api.put(`${BOOKS_ENDPOINT}/${id}`, { title, author });
      await fetchBooks();
    },
    [fetchBooks],
  );

  const handleDelete = useCallback(
    async (id) => {
      await api.delete(`${BOOKS_ENDPOINT}/${id}`);
      await fetchBooks();
    },
    [fetchBooks],
  );

  const sortedBooks = useMemo(
    () => [...books].sort((a, b) => a.id - b.id),
    [books],
  );

  return (
    <div className="app-shell">
      <nav>
        <ul>
          <li>
            <NavLink to="/" end>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/create">Add Book</NavLink>
          </li>
          <li>
            <NavLink to="/update">Update Book</NavLink>
          </li>
          <li>
            <NavLink to="/delete">Delete Book</NavLink>
          </li>
        </ul>
      </nav>

      <main>
        {error && (
          <div role="alert" className="alert">
            <span>{error}</span>
            <button type="button" onClick={fetchBooks}>
              Retry
            </button>
          </div>
        )}

        <Routes>
          <Route path="/" element={<Home books={sortedBooks} isLoading={isLoading} />} />
          <Route path="/create" element={<CreateBook onAdd={handleAdd} />} />
          <Route
            path="/update"
            element={<UpdateBook books={sortedBooks} isLoading={isLoading} onUpdate={handleUpdate} />}
          />
          <Route
            path="/delete"
            element={<DeleteBook books={sortedBooks} isLoading={isLoading} onDelete={handleDelete} />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
