import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Checkout() {

  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {

    fetchData();

  }, []);

  const fetchData = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const cartResponse =
        await api.get(
          "/cart",
          {
            headers:{
              Authorization:
              `Bearer ${token}`
            }
          }
        );

      const profileResponse =
        await api.get(
          "/profile",
          {
            headers:{
              Authorization:
              `Bearer ${token}`
            }
          }
        );

      setCart(
        cartResponse.data.cart
      );

      setUser(
        profileResponse.data.user
      );

    } catch(error){

      console.error(error);

    }

  };

  const confirmOrder = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response =
        await api.post(
          "/cart/checkout",
          {},
          {
            headers:{
              Authorization:
              `Bearer ${token}`
            }
          }
        );

      toast.success(
        response.data.message
      );

      navigate("/orders");

    } catch(error){

      toast.error(
        error.response?.data?.message
      );

    }

  };

  const totalPrice =
    cart.reduce(
      (total,item)=>
      total +
      item.book.price *
      item.quantity,
      0
    );

  if(!user){
    return <h2>Loading...</h2>;
  }

  return (

    <div className="container checkout-page">

      <div className="checkout-header">

        <h1>
          Order Summary
        </h1>

        <p>
          Review before placing order
        </p>

      </div>

      <div className="checkout-layout">

        <div className="checkout-books">

          {
            cart.map(item => (

              <div
                key={item.book._id}
                className="checkout-book"
              >

                <img
                  src={item.book.imageUrl}
                  alt={item.book.title}
                />

                <div>

                  <h3>
                    {item.book.title}
                  </h3>

                  <p>
                    Qty :
                    {item.quantity}
                  </p>

                  <h4>
                    ₹
                    {
                      item.book.price *
                      item.quantity
                    }
                  </h4>

                </div>

              </div>

            ))
          }

        </div>

        <div className="checkout-summary">

  <div className="summary-card">

    <h2>
      📍 Delivery Address
    </h2>

    <div className="address-box">

      <p>
        <strong>
          {user.address?.fullName}
        </strong>
      </p>

      <p>
        {user.address?.phone}
      </p>

      <p>
        {user.address?.addressLine}
      </p>

      <p>
        {user.address?.city},
        {" "}
        {user.address?.state}
      </p>

      <p>
        {user.address?.pincode}
      </p>

    </div>

    <div className="checkout-price-box">

      <div className="price-row">

        <span>
          Books
        </span>

        <strong>
          {cart.length}
        </strong>

      </div>

      <div className="price-row">

        <span>
          Total Amount
        </span>

        <strong>
          ₹{totalPrice}
        </strong>

      </div>

    </div>

    <button
      className="confirm-order-btn"
      onClick={confirmOrder}
    >
      Confirm Order
    </button>

  </div>

</div>

      </div>

    </div>

  );

}

export default Checkout;