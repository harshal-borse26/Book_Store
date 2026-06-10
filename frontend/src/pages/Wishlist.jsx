import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";

function Wishlist() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBooks(response.data.wishlist);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const removeBook = async (bookId) => {
    try {
      const token = localStorage.getItem("token");

      await api.delete(`/wishlist/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBooks(books.filter((book) => book._id !== bookId));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container">
      <div className="orders-header">
        <h1>My Wishlist ❤️</h1>

        <p>Books you want to read later</p>
      </div>

      {books.length === 0 ? (
        <div className="empty-orders">
          <div className="empty-icon">❤️</div>

          <h2>Wishlist Empty</h2>
        </div>
      ) : (
        <div className="books-grid">
          {books.map((book) => (
            <Link key={book._id} to={`/book/${book._id}`} className="book-link">
              <div className="premium-book-card">
                <div className="premium-book-cover">
                  <img src={book.imageUrl} alt={book.title} />
                </div>

                <div className="premium-book-info">
                  <h3>{book.title}</h3>

                  <p>{book.author}</p>

                  <div className="premium-book-footer">
                    <span>₹{book.price}</span>

                    <button
                      className="remove-btn"
                      onClick={(e) => {
                        e.preventDefault();

                        removeBook(book._id);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
