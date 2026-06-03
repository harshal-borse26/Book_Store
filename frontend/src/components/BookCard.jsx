import { Link } from "react-router-dom";

function BookCard({ book }) {
  return (
  
<Link
  to={`/book/${book._id}`}
  className="book-link"
>

  <div className="premium-book-card">

    <div className="premium-book-cover">

      {book.imageUrl ? (
        <img
          src={book.imageUrl}
          alt={book.title}
        />
      ) : (
        <div className="book-placeholder">
          📚
        </div>
      )}

    </div>

    <div className="premium-book-info">

      <h3>{book.title}</h3>

      <p>{book.author}</p>

      <div className="premium-book-footer">

        <span>
          ₹{book.price}
        </span>

        <span>
          View →
        </span>

      </div>

    </div>

  </div>

</Link>

);
}

export default BookCard;