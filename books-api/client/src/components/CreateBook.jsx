import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

function CreateBook({ onAdd }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Add a Book';
    return () => {
      document.title = 'Book Management App';
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title.trim() || !author.trim() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await onAdd(title, author);
      setTitle('');
      setAuthor('');
      navigate('/');
    } catch (error) {
      setSubmitError('Unable to add book. Please try again.');
      // eslint-disable-next-line no-console
      console.error('Failed to add book', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section>
      <h1>Add a New Book</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">
          Book Title
          <input
            id="title"
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter book title"
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
            placeholder="Enter author name"
            disabled={isSubmitting}
          />
        </label>
        <button type="submit" disabled={!title.trim() || !author.trim() || isSubmitting}>
          {isSubmitting ? 'Adding…' : 'Add Book'}
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

CreateBook.propTypes = {
  onAdd: PropTypes.func.isRequired,
};

export default CreateBook;
