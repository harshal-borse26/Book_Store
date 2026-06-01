import { Link } from "react-router-dom";

function BookCard({ book }) {
  return (
    <Link
      to={`/book/${book._id}`}
      className="book-link"
    >
      <div className="book-card">

        <div className="book-cover">
          📚
        </div>

        <div className="book-content">
          <h3>{book.title}</h3>

          <p className="author">
            by {book.author}
          </p>

          <p className="language">
            {book.language}
          </p>

          <div className="book-footer">
            <span className="price">
              ₹{book.price}
            </span>

            <span className="details-btn">
              View Details →
            </span>
          </div>
        </div>

      </div>
    </Link>
  );
}

export default BookCard;