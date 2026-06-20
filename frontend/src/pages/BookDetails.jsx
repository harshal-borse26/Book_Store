import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(5);
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [canReview, setCanReview] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  const [book, setBook] = useState(null);
  const checkCanReview = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const response = await api.get(`/books/${id}/can-review`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCanReview(response.data.canReview);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBook();
    fetchReviews();
    checkCanReview();
    fetchRecommendations();
  }, [id]);

  const fetchBook = async () => {
    try {
      const response = await api.get(`/books/${id}`);

      setBook(response.data.book);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchReviews = async () => {
    try {
      const response = await api.get(`/books/${id}/reviews`);

      setReviews(response.data.reviews);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await api.get(`/books/${id}/recommendations`);

      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.error(error);
    }
  };

  if (!book) {
    return <Loader />;
  }

  const handleBuyNow = async () => {
    const token = localStorage.getItem("token");

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
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Proceeding to checkout");

      navigate("/checkout");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const submitReview = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.post(
        `/books/${id}/review`,
        {
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(response.data.message);

      fetchReviews();

      await checkCanReview();

      setComment("");

      setRating(5);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : 0;

  const ratingCounts = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
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

           <div className="rating-summary">
            <div className="rating-left">
              <h2>⭐ {averageRating}</h2>

              <p>{reviews.length} Reviews</p>
            </div>

            <div className="rating-right">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="rating-row">
                  <span>{star} ★</span>

                  <div className="progress">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${
                          reviews.length
                            ? (ratingCounts[star] / reviews.length) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>

                  <span>{ratingCounts[star]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="description-box">
            <h3>About This Book</h3>

            <p>{book.desc}</p>
          </div>

         

          {canReview && (
            <div className="review-form">
              <h2>Write a Review</h2>

              <div className="star-selector">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setRating(star)}
                    className={star <= rating ? "active-star" : ""}
                  >
                    ★
                  </span>
                ))}
              </div>

              <textarea
                placeholder="Write your review..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <button onClick={submitReview} className="buy-btn">
                Submit Review
              </button>
            </div>
          )}

          {!canReview && (
            <div className="review-lock">
              📦 Purchase and receive this book to write a review.
            </div>
          )}

          <div className="reviews-section">
            <h2>Customer Reviews</h2>

            {reviews.length === 0 ? (
              <p>No reviews yet.</p>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="review-card">
                  <div className="review-header">
                    <div>
                      <h4>👤 {review.user?.username || review.username}</h4>

                      <span>{"⭐".repeat(review.rating)}</span>
                    </div>

                    {review.verifiedPurchase && (
                      <span className="verified-badge">
                        ✔ Verified Purchase
                      </span>
                    )}
                  </div>

                  <p>{review.comment}</p>

                  <small>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </small>
                </div>
              ))
            )}
          </div>

          <div className="recommend-section">
            <h2>📚 You May Also Like</h2>

            <div className="recommend-grid">
              {recommendations.map((book) => (
                <div
                  key={book._id}
                  className="recommend-card"
                  onClick={() => navigate(`/book/${book._id}`)}
                >
                  <img src={book.imageUrl} alt={book.title} />

                  <h4>{book.title}</h4>

                  <p>{book.author}</p>

                  <strong>₹{book.price}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;
