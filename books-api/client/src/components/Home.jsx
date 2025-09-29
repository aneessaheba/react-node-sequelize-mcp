import PropTypes from 'prop-types';

function Home({ books, isLoading }) {
  return (
    <section>
      <h1>Book Catalog</h1>
      {isLoading && <p className="status">Loading books...</p>}
      {books.length === 0 && !isLoading ? (
        <p>No books available. Add your first book!</p>
      ) : (
        <table className="table" role="grid">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Title</th>
              <th scope="col">Author</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>{book.id}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

Home.propTypes = {
  books: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
    }),
  ).isRequired,
  isLoading: PropTypes.bool,
};

Home.defaultProps = {
  isLoading: false,
};

export default Home;
