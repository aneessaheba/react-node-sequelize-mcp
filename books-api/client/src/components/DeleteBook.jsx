import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

function DeleteBook({ books, isLoading, onDelete }) {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (books.length === 0) {
      setSelectedId('');
      return;
    }
    setSelectedId((current) => {
      const currentId = Number(current);
      const stillExists = books.some((book) => book.id === currentId);
      return stillExists ? current : String(books[0].id);
    });
  }, [books]);

  const handleDelete = async () => {
    if (!selectedId || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await onDelete(Number(selectedId));
      navigate('/');
    } catch (error) {
      setSubmitError('Unable to delete book. Please try again.');
      // eslint-disable-next-line no-console
      console.error('Failed to delete book', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && books.length === 0) {
    return (
      <section>
        <h1>Delete Book</h1>
        <p className="status">Loading books...</p>
      </section>
    );
  }

  if (books.length === 0) {
    return (
      <section>
        <h1>Delete Book</h1>
        <p>No books available to delete. Add a book first.</p>
      </section>
    );
  }

  return (
    <section>
      <h1>Delete Book</h1>
      <p>Select a book to remove it from the catalog.</p>
      <select value={selectedId} onChange={(event) => setSelectedId(event.target.value)} disabled={isSubmitting}>
        {books.map((book) => (
          <option key={book.id} value={book.id}>
            #{book.id} • {book.title}
          </option>
        ))}
      </select>
      <div>
        <button type="button" onClick={handleDelete} disabled={isSubmitting}>
          {isSubmitting ? 'Deleting…' : 'Delete Book'}
        </button>
      </div>
      {submitError && (
        <p role="alert" className="form-error">
          {submitError}
        </p>
      )}
    </section>
  );
}

DeleteBook.propTypes = {
  books: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
    }),
  ).isRequired,
  isLoading: PropTypes.bool,
  onDelete: PropTypes.func.isRequired,
};

DeleteBook.defaultProps = {
  isLoading: false,
};

export default DeleteBook;
