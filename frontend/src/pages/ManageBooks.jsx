import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function ManageBooks() {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await api.get("/books");
      setBooks(response.data.books);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteBook = async (bookId) => {
    const confirmDelete =
      window.confirm("Delete this book?");

    if (!confirmDelete) return;

    try {
      const token =
        localStorage.getItem("token");

      const response =
        await api.delete(
          `/books/${bookId}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      toast.success(
        response.data.message
      );

      fetchBooks();

    } catch (error) {

      toast.error(
        error.response?.data?.message
      );

    }
  };

  return (
    <div className="manage-books-page">

      <div className="container">

        <div className="manage-books-header">

          <div>

            <span className="admin-tag">
              📚 Admin Panel
            </span>

            <h1>
              Manage Books
            </h1>

            <p>
              Update, manage and organize
              your bookstore collection.
            </p>

          </div>

          <button
            className="add-book-btn"
            onClick={() =>
              navigate("/add-book")
            }
          >
            + Add New Book
          </button>

        </div>


        <div className="manage-books-grid">

          {books.map((book) => (

            <div
              key={book._id}
              className="manage-book-card"
            >

              <div className="manage-book-image">

                <img
                  src={book.imageUrl}
                  alt={book.title}
                />

              </div>

              <div className="manage-book-content">

                <h3>
                  {book.title}
                </h3>

                <p>
                  {book.author}
                </p>

                <div className="book-meta">

                  <span>
                    ₹{book.price}
                  </span>

                  <span>
                    Stock:
                    {book.stock}
                  </span>

                </div>

                <div className="admin-book-actions">

                  <button
                    className="edit-book-btn"
                    onClick={() =>
                      navigate(
                        `/edit-book/${book._id}`
                      )
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="delete-book-btn"
                    onClick={() =>
                      deleteBook(book._id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default ManageBooks;