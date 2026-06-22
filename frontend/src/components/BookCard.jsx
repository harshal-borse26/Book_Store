import { Link } from "react-router-dom";

function BookCard({ book }) {
  const rating = book.averageRating
    ? Number(book.averageRating).toFixed(1)
    : "4.2";

  return (
    <Link to={`/book/${book._id}`} className="book-link">
      <article className="book-card-pro">
        <div className="book-cover-pro">
          <img
            src={book.imageUrl}
            alt={book.title}
            className="book-cover-image-pro"
          />

          <div className="book-cover-overlay-pro" />

          <div className="book-rating-pill">
            ⭐ {rating}
          </div>
        </div>

        <div className="book-body-pro">
          <div className="book-topline-pro">
            <span className="book-language-pill">
              {book.language}
            </span>

            <span className="book-reviews-text">
              {book.totalReviews || 0} reviews
            </span>
          </div>

          <h3 className="book-title-pro">{book.title}</h3>

          <p className="book-author-pro">{book.author}</p>

          <div className="book-footer-pro">
            <div>
              <span className="book-price-label">Price</span>
              <div className="book-price-pro">₹{book.price}</div>
            </div>

            <span className="book-arrow-pro">→</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default BookCard;