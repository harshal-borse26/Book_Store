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
    const confirmDelete = window.confirm("Delete this book?");

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const response = await api.delete(`/books/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(response.data.message);

      fetchBooks();
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div className="container">
      <div className="orders-header">
        <h1>Manage Books</h1>

        <p>Edit or delete books</p>
      </div>

      <div className="books-grid">
        {books.map((book) => (
          <div key={book._id} className="premium-book-card">
            <div className="premium-book-cover">
              <img src={book.imageUrl} alt={book.title} />
            </div>

            <div className="premium-book-info">
              <h3>{book.title}</h3>

              <p>{book.author}</p>

              <div className="admin-book-actions">
                <button
  className="edit-btn"
  onClick={() =>
    navigate(
      `/edit-book/${book._id}`
    )
  }
>
  Edit
</button>

                <button
                  className="delete-btn"
                  onClick={() => deleteBook(book._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageBooks;
