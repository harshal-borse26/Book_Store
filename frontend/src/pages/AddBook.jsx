import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
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

  const [preview, setPreview] = useState("");
 

 const handleChange = (e) => {

  const { name, value, files } = e.target;

  if (files) {

    setFormData({
      ...formData,
      image: files[0]
    });

    setPreview(
      URL.createObjectURL(files[0])
    );

  } else {

    setFormData({
      ...formData,
      [name]: value
    });

  }

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

      toast.success(
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

      toast.error(
        error.response?.data?.message ||
        "Failed to add book"
      );

    }
  };

  return (
    
    <div className="add-book-page">

  <div className="add-book-header">

    <h1>Add New Book</h1>

    <p>
      Upload a new book to your collection
    </p>

  </div>

  <form
    onSubmit={handleSubmit}
    className="add-book-form"
  >

    <div className="book-form-card">

      <h2>Book Information</h2>

      <div className="form-grid">

        <input
          name="title"
          placeholder="Book Title"
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

      </div>

      <input
        name="stock"
        placeholder="Stock Quantity"
        value={formData.stock}
        onChange={handleChange}
      />

      <textarea
        name="desc"
        placeholder="Book Description"
        value={formData.desc}
        onChange={handleChange}
      />

    </div>

    <div className="upload-card">

      <h2>Book Cover</h2>

      <label className="upload-box">

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          hidden
        />

        {
          preview ? (
            <img
              src={preview}
              alt="preview"
              className="preview-image"
            />
          ) : (
            <>
              <span className="upload-icon">
                📚
              </span>

              <p>
                Click to Upload Cover
              </p>
            </>
          )
        }

      </label>

    </div>

    <button
      type="submit"
      className="submit-book-btn"
    >
      Add Book
    </button>

    

  </form>

</div>

  );
}

export default AddBook;