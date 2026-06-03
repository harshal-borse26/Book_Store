import { useEffect, useState } from "react";
import api from "../services/api";
import BookCard from "../components/BookCard";
import Loader from "../components/Loader";

function Books() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await api.get("/books");

      setBooks(response.data.books);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase()),
  );

  

  return (
    <div className="container books-page">
      <div className="books-hero">
        <span className="books-tag">Library Collection</span>

        <h1>
          Discover
          <span> Great Books</span>
        </h1>

        <p>
          Explore programming, finance, productivity and self-development books.
        </p>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="books-info">
        <div className="book-count">{filteredBooks.length} Books Available</div>
      </div>

        <div className="books-grid">
          {filteredBooks.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
    </div>
  );
}

export default Books;
