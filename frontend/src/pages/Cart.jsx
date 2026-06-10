import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCart(response.data.cart);
    } catch (error) {
      console.error(error);
    }
  };

  const removeBook = async (bookId) => {
    try {
      const token = localStorage.getItem("token");

      await api.delete(`/cart/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchCart();
    } catch (error) {
      console.error(error);
    }
  };

  const updateQuantity = async (bookId, action) => {
    try {
      const token = localStorage.getItem("token");

      await api.put(
        "/cart/quantity",
        {
          bookId,
          action,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchCart();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.book.price * item.quantity,
    0,
  );

  return (
    <div className="container orders-page">
      <div className="orders-header">
        <h1>Shopping Cart</h1>
        <p>Review your selected books</p>
      </div>

      {cart.length === 0 ? (
        <div className="empty-orders">
          <div className="empty-icon">🛒</div>

          <h2>Cart is Empty</h2>
        </div>
      ) : (
        <>
          <div className="cart-layout">
            <div className="cart-items">
              {cart.map((item) => (
                <Link to={`/book/${item.book._id}`} className="cart-book-link">
                  <div className="cart-book-card">
                    <img
                      src={item.book.imageUrl}
                      alt={item.book.title}
                      className="cart-book-image"
                    />

                    <div className="cart-book-info">
                      <h3>{item.book.title}</h3>

                      <p>₹{item.book.price}</p>

                      <div className="qty-box">
                        <button
                          onClick={(e) => {
                            e.preventDefault();

                            removeBook(item.book._id);
                          }}
                        >
                          -
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          onClick={() =>
                            updateQuantity(item.book._id, "increase")
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      className="remove-btn"
                      onClick={() => removeBook(item.book._id)}
                    >
                      Remove
                    </button>
                  </div>
                </Link>
              ))}
            </div>

            <div className="cart-summary-card">
              <h3>Order Summary</h3>

              <div className="summary-row">
                <span>Books</span>

                <strong>{cart.length}</strong>
              </div>

              <div className="summary-row">
                <span>Total</span>

                <strong>₹{totalPrice}</strong>
              </div>

              <button className="buy-btn" onClick={handleCheckout}>
                Proceed To Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
