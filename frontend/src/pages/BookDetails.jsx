import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import api from "../services/api";



function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");

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
    return (
      <div className="container">
        <h2>Loading...</h2>
      </div>
    );
  }
   
  const handleBuyNow = async () => {

  const token =
    localStorage.getItem("token");

  if (!token) {
    navigate("/login");
    return;
  }

  try {

    const response = await api.post(
      "/order/plaaceorder",
      {
        books: [
          {
            bookId: book._id,
            quantity: 1
          }
        ]
      },
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    setMessage(
      response.data.message
    );

  } catch (error) {

    setMessage(
      error.response?.data?.message ||
      "Order failed"
    );

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

        <h1>{book.title}</h1>

        <p className="details-author">
          by {book.author}
        </p>

        <div className="details-info">

          <div>
            <strong>Language</strong>
            <p>{book.language}</p>
          </div>

          <div>
            <strong>Stock</strong>
            <p>{book.stock}</p>
          </div>

          <div>
            <strong>Price</strong>
            <p>₹{book.price}</p>
          </div>

          <button                           
            className="buy-btn"
            onClick={handleBuyNow}
          >
            Buy Now
          </button>

        </div>

        <div className="description-box">
          <h3>Description</h3>
          <p>{book.desc}</p>
        </div>

        {
        message &&
        <p className="order-message">
          {message}
        </p>
        }

      </div>

    </div>

  </div>
);
}

export default BookDetails;