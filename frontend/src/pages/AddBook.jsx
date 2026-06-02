import { useState } from "react";
import api from "../services/api";

function AddBook() {

  const [formData, setFormData] = useState({
  title: "",
  author: "",
  price: "",
  desc: "",
  language: "",
  stock: "",
  image: null
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {

  const { name, value, files } = e.target;

  setFormData({
    ...formData,
    [name]: files ? files[0] : value
  });

};

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const token =
        localStorage.getItem("token");

      const bookData = new FormData();

        bookData.append("title", formData.title);
        bookData.append("author", formData.author);
        bookData.append("price", formData.price);
        bookData.append("desc", formData.desc);
        bookData.append("language", formData.language);
        bookData.append("stock", formData.stock);

        if (formData.image) {
          bookData.append(
            "image",
            formData.image
          );
        }

        const response = await api.post(
          "/books/addbook",
          bookData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type":
                "multipart/form-data"
            }
          }
        );

      setMessage(
        response.data.message
      );

      setFormData({
        title: "",
        author: "",
        price: "",
        desc: "",
        language: "",
        stock: "",
        image: null
      });

    } catch (error) {

      setMessage(
        error.response?.data?.message ||
        "Failed to add book"
      );

    }
  };

  return (
    <div className="auth-container">

      <div className="auth-card">

        <h1>Add New Book</h1>

        <form onSubmit={handleSubmit}>

          <input
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
          />

          <input
            name="author"
            placeholder="Author"
            value={formData.author}
            onChange={handleChange}
          />

          <input
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
          />

          <input
            name="language"
            placeholder="Language"
            value={formData.language}
            onChange={handleChange}
          />

          <input
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
          />

          <textarea
            name="desc"
            placeholder="Description"
            value={formData.desc}
            onChange={handleChange}
          />

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />

          <button type="submit">
            Add Book
          </button>

        </form>

        {message && (
          <p className="auth-message">
            {message}
          </p>
        )}

      </div>

    </div>
  );
}

export default AddBook;