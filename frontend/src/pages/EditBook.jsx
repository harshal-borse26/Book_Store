import {
  useEffect,
  useState
} from "react";

import {
  useParams,
  useNavigate
} from "react-router-dom";

import api from "../services/api";
import toast from "react-hot-toast";

function EditBook() {

  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const [formData,
    setFormData] =
    useState({

      title:"",
      author:"",
      price:"",
      stock:"",
      language:"",
      desc:""

    });

  useEffect(() => {

    fetchBook();

  }, []);

  const fetchBook =
    async () => {

    try {

      const response =
        await api.get(
          `/books/${id}`
        );

      const book =
        response.data.book;

      setFormData({

        title:
        book.title,

        author:
        book.author,

        price:
        book.price,

        stock:
        book.stock,

        language:
        book.language,

        desc:
        book.desc

      });

    } catch(error){

      console.error(error);

    }

  };

  const handleChange =
    (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
      e.target.value

    });

  };

  const handleSubmit =
    async (e) => {

    e.preventDefault();

    try {

      const token =
        localStorage.getItem(
          "token"
        );

      await api.put(

        `/books/${id}`,

        formData,

        {
          headers:{
            Authorization:
            `Bearer ${token}`
          }
        }

      );

      toast.success(
        "Book Updated"
      );

      navigate(
        "/admin/books"
      );

    } catch(error){

      toast.error(
        "Update Failed"
      );

    }

  };

  return (

    <div className="edit-book-page">

  <div className="container">

    <div className="edit-book-header">

      <div>
        <span className="edit-tag">
          📚 Admin Panel
        </span>

        <h1>Edit Book</h1>

        <p>
          Update book details, pricing, stock and metadata.
        </p>
      </div>

    </div>

    <div className="edit-book-layout">

      <div className="edit-book-card">

        <form
          onSubmit={handleSubmit}
          className="edit-book-form"
        >

          <div className="form-group">
            <label>Book Title</label>

            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter book title"
            />
          </div>

          <div className="form-group">
            <label>Author</label>

            <input
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Author name"
            />
          </div>

          <div className="form-row">

            <div className="form-group">
              <label>Price</label>

              <input
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price"
              />
            </div>

            <div className="form-group">
              <label>Stock</label>

              <input
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Stock"
              />
            </div>

          </div>

          <div className="form-group">
            <label>Language</label>

            <input
              name="language"
              value={formData.language}
              onChange={handleChange}
              placeholder="Language"
            />
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              name="desc"
              value={formData.desc}
              onChange={handleChange}
              placeholder="Book description"
            />
          </div>

          <button
            type="submit"
            className="update-book-btn"
          >
            Save Changes
          </button>

        </form>

      </div>

      <div className="book-preview-card">

        <div className="preview-icon">
          📖
        </div>

        <h3>{formData.title || "Book Title"}</h3>

        <p>
          {formData.author || "Author"}
        </p>

        <div className="preview-stats">

          <div>
            <span>Price</span>
            <strong>₹{formData.price || 0}</strong>
          </div>

          <div>
            <span>Stock</span>
            <strong>{formData.stock || 0}</strong>
          </div>

        </div>

        <div className="preview-language">
          {formData.language || "Language"}
        </div>

      </div>

    </div>

  </div>

</div>

  );

}

export default EditBook;