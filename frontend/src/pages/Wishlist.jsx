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

      setBooks(response.data.wishlist || []);
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

      setBooks((prev) => prev.filter((book) => book._id !== bookId));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container wishlist-page">
      <div className="wishlist-header">
        <span className="wishlist-tag">Saved Collection</span>

        <h1>My Wishlist ❤️</h1>

        <p>Books you want to read later</p>

        <div className="wishlist-count">
          {books.length} Saved Book{books.length !== 1 ? "s" : ""}
        </div>
      </div>

      {books.length === 0 ? (
        <div className="wishlist-empty">
          <div className="wishlist-empty-icon">❤️</div>

          <h2>Your wishlist is empty</h2>

          <p>Start exploring books and save the ones you like for later.</p>

          <Link to="/books" className="wishlist-empty-btn">
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {books.map((book) => (
            <div key={book._id} className="wishlist-card">
              <Link to={`/book/${book._id}`} className="wishlist-card-link">
                <div className="wishlist-image">
                  <img src={book.imageUrl} alt={book.title} />
                </div>

                <div className="wishlist-content">
                  <h3>{book.title}</h3>
                  <p>{book.author}</p>

                  <div className="wishlist-footer">
                    <span className="wishlist-price">₹{book.price}</span>
                  </div>
                </div>
              </Link>

              <button
                className="wishlist-remove-btn"
                onClick={() => removeBook(book._id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;