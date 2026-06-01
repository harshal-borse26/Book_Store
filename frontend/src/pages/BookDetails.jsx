import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function BookDetails() {
  const { id } = useParams();

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

  return (
  <div className="container details-page">

    <div className="details-card">

      <div className="details-cover">
        📖
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

        </div>

        <div className="description-box">
          <h3>Description</h3>
          <p>{book.desc}</p>
        </div>

      </div>

    </div>

  </div>
);
}

export default BookDetails;