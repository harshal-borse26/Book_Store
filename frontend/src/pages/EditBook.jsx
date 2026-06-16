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

    <div className="container">

      <div className="auth-card">

        <h1>
          Edit Book
        </h1>

        <form
          onSubmit={
            handleSubmit
          }
        >

          <input
            name="title"
            value={
              formData.title
            }
            onChange={
              handleChange
            }
            placeholder="Title"
          />

          <input
            name="author"
            value={
              formData.author
            }
            onChange={
              handleChange
            }
            placeholder="Author"
          />

          <input
            name="price"
            value={
              formData.price
            }
            onChange={
              handleChange
            }
            placeholder="Price"
          />

          <input
            name="stock"
            value={
              formData.stock
            }
            onChange={
              handleChange
            }
            placeholder="Stock"
          />

          <input
            name="language"
            value={
              formData.language
            }
            onChange={
              handleChange
            }
            placeholder="Language"
          />

          <textarea
            name="desc"
            value={
              formData.desc
            }
            onChange={
              handleChange
            }
            placeholder="Description"
          />

          <button
            type="submit"
          >
            Update Book
          </button>

        </form>

      </div>

    </div>

  );

}

export default EditBook;