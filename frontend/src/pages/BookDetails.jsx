import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);

  useEffect(() => {
    fetchBook();
  }, []);
  

  const fetchBook = async () => {
    try {
      const response = await api.get(`/books/${id}`);

      setBook(response.data.book);
    } catch (error) {
      console.error(error);
    }
  };

  if (!book) {
    return <Loader />;
  }

 const handleBuyNow = async () => {

  const token =
    localStorage.getItem("token");

  if (!token) {

    navigate("/login");

    return;

  }

  try {

    await api.post(
      "/cart/add",
      {
        bookId: book._id,
      },
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    toast.success(
      "Proceeding to checkout"
    );

    navigate("/checkout");

  } catch (error) {

    toast.error(
      error.response?.data?.message ||
      "Something went wrong"
    );

  }

};

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await api.post(
        "/cart/add",
        {
          bookId: book._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(`"${book.title}" added to cart 🛒`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    }
  };

  const handleWishlist = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");

        return;
      }

      const response = await api.post(
        `/wishlist/${book._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(response.data.message);

      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div className="container details-page">
      <div className="details-card">
        <div className="details-cover">
          {book.imageUrl ? (
            <img
              src={book.imageUrl}
              alt={book.title}
              className="details-image"
            />
          ) : (
            "📖"
          )}
        </div>

        <div className="details-content">
          <span className="book-badge">⭐ Reader's Choice</span>

          <h1>{book.title}</h1>

          <p className="details-author">by {book.author}</p>

          <div className="price-section">
            <span className="price-label">Starting From</span>

            <h2>₹{book.price}</h2>
          </div>

          <div className="details-meta">
            <div className="meta-card">
              <span>Language</span>

              <strong>{book.language}</strong>
            </div>

            <div className="meta-card">
              <span>Available</span>

              <strong>{book.stock} Books</strong>
            </div>
          </div>

          <div className="action-buttons">
            <button className="buy-btn" onClick={handleBuyNow}>
              🛒 Buy Now
            </button>

            <button className="wishlist-btn" onClick={handleAddToCart}>
              Add To Cart
            </button>

            <button className="wishlist-btn" onClick={handleWishlist}>
              ❤️ Save
            </button>
          </div>

          <div className="description-box">
            <h3>About This Book</h3>

            <p>{book.desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;
