import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const reviewFormRef = useRef(null);

  const [book, setBook] = useState(null);
  const [allBooks, setAllBooks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [canReview, setCanReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const [submittingReview, setSubmittingReview] = useState(false);

  const formatPrice = (value) =>
    new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(Number(value || 0));

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
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllBooks = async () => {
    try {
      const response = await api.get("/books");
      setAllBooks(response.data.books || []);
    } catch (error) {
      console.error(error);
    }
  };

  const checkCanReview = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setCanReview(false);
        return;
      }

      const response = await api.get(`/books/${id}/can-review`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCanReview(Boolean(response.data.canReview));
    } catch (error) {
      console.error(error);
      setCanReview(false);
    }
  };

  const loadPage = async () => {
    setLoading(true);

    try {
      await Promise.all([fetchBook(), fetchReviews(), fetchAllBooks()]);
      await checkCanReview();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage();
    setRating(5);
    setComment("");
    setActiveTab("about");
    setShowReviewForm(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const totalReviews = reviews.length;

  const averageRatingValue = useMemo(() => {
    if (reviews.length > 0) {
      const sum = reviews.reduce(
        (total, review) => total + Number(review.rating || 0),
        0,
      );
      return sum / reviews.length;
    }

    return Number(book?.averageRating || 0);
  }, [reviews, book]);

  const averageRating = averageRatingValue
    ? averageRatingValue.toFixed(1)
    : "0.0";

  const ratingCounts = useMemo(() => {
    return {
      5: reviews.filter((r) => Number(r.rating) === 5).length,
      4: reviews.filter((r) => Number(r.rating) === 4).length,
      3: reviews.filter((r) => Number(r.rating) === 3).length,
      2: reviews.filter((r) => Number(r.rating) === 2).length,
      1: reviews.filter((r) => Number(r.rating) === 1).length,
    };
  }, [reviews]);

  const isInStock = Number(book?.stock || 0) > 0;

  const recommendedBooks = useMemo(() => {
    if (!book) return [];

    const normalize = (value) =>
      String(value || "")
        .trim()
        .toLowerCase();
    const currentAuthor = normalize(book.author);
    const currentLanguage = normalize(book.language);

    return allBooks
      .filter((item) => item._id !== book._id)
      .map((item) => {
        const sameAuthor = normalize(item.author) === currentAuthor;
        const sameLanguage = normalize(item.language) === currentLanguage;
        const itemRating = Number(item.averageRating || 0);

        let score = 0;
        if (sameAuthor) score += 3;
        if (sameLanguage) score += 2;
        score += itemRating * 0.4;

        return { ...item, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [allBooks, book]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!isInStock) {
      toast.error("This book is currently out of stock");
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

      toast.success(`"${book.title}" added to cart 🛒`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    }
  };

  const handleBuyNow = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!isInStock) {
      toast.error("This book is currently out of stock");
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
      toast.error(error.response?.data?.message || "Failed to update wishlist");
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Book link copied");
    } catch (error) {
      console.error(error);
      toast.error("Could not copy link");
    }
  };

  const openReviewForm = () => {
    if (!canReview) return;

    setShowReviewForm(true);

    window.setTimeout(() => {
      reviewFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  };

  const submitReview = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      if (!comment.trim()) {
        toast.error("Please write your review first");
        return;
      }

      setSubmittingReview(true);

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

      setComment("");
      setRating(5);
      setShowReviewForm(false);

      await fetchReviews();
      await checkCanReview();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!book) {
    return (
      <div className="container details-page">
        <div className="book-not-found">
          <h2>Book not found</h2>
          <p>
            The book you are looking for no longer exists or could not load.
          </p>
          <button onClick={() => navigate("/books")}>Back to Books</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container details-page">
      <div className="book-detail-page">
        <div className="book-breadcrumbs">
          <Link to="/">Home</Link>
          <span>›</span>
          <Link to="/books">Books</Link>
          <span>›</span>
          <span>{book.language || "Book"}</span>
          <span>›</span>
          <strong>{book.title}</strong>
        </div>

        <section className="product-shell">
          <div className="product-grid">
            <div className="product-cover-column">
              <div className="product-cover-card">
                {book.imageUrl ? (
                  <img
                    src={book.imageUrl}
                    alt={book.title}
                    className="product-cover-image"
                  />
                ) : (
                  <div className="product-cover-placeholder">📚</div>
                )}
              </div>

              <div className="product-cover-actions">
                <button type="button" onClick={handleWishlist}>
                  ♡ Wishlist
                </button>

                <button type="button" onClick={handleShare}>
                  ↗ Share
                </button>

                <button
                  className="wish-btn"
                  onClick={() => navigate(`/journey?bookId=${book._id}`)}
                >
                  Track Journey
                </button>
                
              </div>
            </div>

            <div className="product-info-column">
              <span className="product-badge">{book.language || "Book"}</span>

              <h1>{book.title}</h1>

              <p className="product-author">by {book.author}</p>

              <div className="product-rating-line">
                <span className="product-rating-star">⭐ {averageRating}</span>
                <span>
                  {totalReviews} Review{totalReviews === 1 ? "" : "s"}
                </span>
                <span>•</span>
                <span>
                  {isInStock ? "Available now" : "Currently unavailable"}
                </span>
              </div>

              <p className="product-description">{book.desc}</p>

              <div className="product-facts-grid">
                <div className="fact-card">
                  <span>Language</span>
                  <strong>{book.language || "—"}</strong>
                </div>

                <div className="fact-card">
                  <span>Stock</span>
                  <strong>
                    {isInStock
                      ? `${book.stock} Copy${Number(book.stock) === 1 ? "" : "ies"}`
                      : "Out of stock"}
                  </strong>
                </div>

                <div className="fact-card">
                  <span>Average Rating</span>
                  <strong>{averageRating}</strong>
                </div>

                <div className="fact-card">
                  <span>Reviews</span>
                  <strong>{totalReviews}</strong>
                </div>
              </div>
            </div>

            <aside className="purchase-card">
              <div className="purchase-price">₹{formatPrice(book.price)}</div>

              <p className="purchase-note">Inclusive of all taxes</p>

              <div
                className={`stock-pill ${isInStock ? "in-stock" : "out-stock"}`}
              >
                {isInStock ? `In Stock • ${book.stock} left` : "Out of stock"}
              </div>

              <button
                type="button"
                className="purchase-btn dark"
                onClick={handleAddToCart}
                disabled={!isInStock}
              >
                Add To Cart
              </button>

              <button
                type="button"
                className="purchase-btn gold"
                onClick={handleBuyNow}
                disabled={!isInStock}
              >
                Buy Now
              </button>

              <div className="purchase-features">
                <div className="purchase-feature">
                  <span>🚚</span>
                  <div>
                    <strong>Free Delivery</strong>
                    <p>On eligible orders</p>
                  </div>
                </div>

                <div className="purchase-feature">
                  <span>🔄</span>
                  <div>
                    <strong>Easy Returns</strong>
                    <p>Simple return support</p>
                  </div>
                </div>

                <div className="purchase-feature">
                  <span>🔒</span>
                  <div>
                    <strong>Happy Readers</strong>
                    <p>Trusted by book lovers</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="reviews-section-card">
          <div className="section-head-row">
            <div>
              <span className="section-kicker">Ratings & Reviews</span>
              <h2>Customer Reviews</h2>
            </div>

            {canReview ? (
              <button
                type="button"
                className="write-review-btn"
                onClick={openReviewForm}
              >
                Write a Review
              </button>
            ) : (
              <div className="section-lock-note">
                Purchase this book to write a review
              </div>
            )}
          </div>

          <div className="reviews-layout">
            <div className="rating-summary-card">
              <div className="rating-overview">
                <div className="rating-value">
                  {averageRating}
                  <span>★</span>
                </div>

                <div className="rating-stars-row">{"★★★★★"}</div>

                <p>{totalReviews} reviews</p>
              </div>
            </div>

            <div className="rating-bars-card">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratingCounts[star];
                const width = totalReviews ? (count / totalReviews) * 100 : 0;

                return (
                  <div key={star} className="rating-row">
                    <span className="rating-label">{star} ★</span>

                    <div className="progress">
                      <div
                        className="progress-fill"
                        style={{ width: `${width}%` }}
                      />
                    </div>

                    <span className="rating-count">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {canReview ? (
            <div
              ref={reviewFormRef}
              className={`review-form-card ${showReviewForm ? "visible" : ""}`}
            >
              <div className="review-form-head">
                <h3>Write a Review</h3>
                <p>Your opinion helps other readers choose better.</p>
              </div>

              <div className="star-selector">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={star <= rating ? "active-star" : ""}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </button>
                ))}
              </div>

              <textarea
                placeholder="Write your review..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <button
                type="button"
                className="purchase-btn dark submit-review-btn"
                onClick={submitReview}
                disabled={submittingReview}
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          ) : (
            <div className="review-lock-card">
              📦 Purchase and receive this book to write a review.
            </div>
          )}

          <div className="customer-reviews-card">
            <h3>Customer Reviews</h3>

            {reviews.length === 0 ? (
              <div className="empty-inline">No reviews yet.</div>
            ) : (
              <div className="reviews-list">
                {reviews.map((review) => {
                  const name =
                    review.user?.username || review.username || "Reader";
                  const avatar = name.trim().charAt(0).toUpperCase();

                  return (
                    <div key={review._id} className="single-review">
                      <div className="review-user">
                        <div className="review-avatar">{avatar}</div>

                        <div className="review-user-meta">
                          <div className="review-user-top">
                            <h4>{name}</h4>

                            {review.verifiedPurchase && (
                              <span className="verified-badge">
                                Verified Buyer
                              </span>
                            )}
                          </div>

                          <div className="review-stars">
                            {"★".repeat(Number(review.rating || 0))}
                          </div>

                          <small>
                            {new Date(review.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                      </div>

                      <p className="review-text">{review.comment}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="recommend-section-card">
          <div className="section-head-row">
            <div>
              <span className="section-kicker">Similar Books</span>
              <h2>You May Also Like</h2>
            </div>

            <Link to="/books" className="view-all-link">
              View all →
            </Link>
          </div>

          {recommendedBooks.length > 0 ? (
            <div className="recommend-grid">
              {recommendedBooks.map((item) => {
                const itemAverage = item.averageRating
                  ? Number(item.averageRating).toFixed(1)
                  : "4.5";

                return (
                  <Link
                    key={item._id}
                    to={`/book/${item._id}`}
                    className="recommend-card"
                  >
                    <div className="recommend-image">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} />
                      ) : (
                        <div className="recommend-placeholder">📚</div>
                      )}

                      <span className="recommend-rating">⭐ {itemAverage}</span>
                    </div>

                    <div className="recommend-content">
                      <span className="recommend-category">
                        {item.language || "Book"}
                      </span>

                      <h4>{item.title}</h4>

                      <p>{item.author}</p>

                      <div className="recommend-footer">
                        <strong>₹{formatPrice(item.price)}</strong>
                        <span>View →</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="recommend-empty">
              More recommendations will appear here as the catalog grows.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default BookDetails;
