import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

function UpdateBook({ books, isLoading, onUpdate }) {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const options = useMemo(
    () => books.map((book) => ({ value: book.id, label: `#${book.id} • ${book.title}` })),
    [books],
  );

  useEffect(() => {
    if (books.length === 0) {
      setSelectedId('');
      setTitle('');
      setAuthor('');
      return;
    }
    setSelectedId((current) => {
      const currentId = Number(current);
      const stillExists = books.some((book) => book.id === currentId);
      return stillExists ? current : String(books[0].id);
    });
  }, [books]);

  useEffect(() => {
    const activeBook = books.find((book) => book.id === Number(selectedId));
    if (activeBook) {
      setTitle(activeBook.title);
      setAuthor(activeBook.author);
    }
  }, [selectedId, books]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedId || !title.trim() || !author.trim() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await onUpdate(Number(selectedId), title, author);
      navigate('/');
    } catch (error) {
      setSubmitError('Unable to update book. Please try again.');
      // eslint-disable-next-line no-console
      console.error('Failed to update book', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && books.length === 0) {
    return (
      <section>
        <h1>Update Book</h1>
        <p className="status">Loading books...</p>
      </section>
    );
  }

  if (books.length === 0) {
    return (
      <section>
        <h1>Update Book</h1>
        <p>No books available to update. Add a book first.</p>
      </section>
    );
  }

  return (
    <section>
      <h1>Update Book</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="bookSelect">
          Choose a Book
          <select
            id="bookSelect"
            value={selectedId}
            onChange={(event) => setSelectedId(event.target.value)}
            disabled={isSubmitting}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="title">
          Book Title
          <input
            id="title"
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            disabled={isSubmitting}
          />
        </label>
        <label htmlFor="author">
          Author Name
          <input
            id="author"
            name="author"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            disabled={isSubmitting}
          />
        </label>
        <button type="submit" disabled={!title.trim() || !author.trim() || isSubmitting}>
          {isSubmitting ? 'Updating…' : 'Update Book'}
        </button>
        {submitError && (
          <p role="alert" className="form-error">
            {submitError}
          </p>
        )}
      </form>
    </section>
  );
}

UpdateBook.propTypes = {
  books: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
    }),
  ).isRequired,
  isLoading: PropTypes.bool,
  onUpdate: PropTypes.func.isRequired,
};

UpdateBook.defaultProps = {
  isLoading: false,
};

export default UpdateBook;
