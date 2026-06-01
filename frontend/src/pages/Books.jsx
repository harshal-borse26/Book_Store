import { useEffect, useState } from "react";
import api from "../services/api";
import BookCard from "../components/BookCard";

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await api.get("/books");

      setBooks(response.data.books);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <h2>Loading Books...</h2>
      </div>
    );
  }

  return (
  <div className="container books-page">

    <div className="books-header">
      <h1>Our Collection</h1>

      <p>
        Explore books from our library.
      </p>
    </div>

    <div className="books-grid">
      {books.map((book) => (
        <BookCard
          key={book._id}
          book={book}
        />
      ))}
    </div>

  </div>
);
}

export default Books;