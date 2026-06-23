import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const formatPrice = (value) =>
    new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(Number(value || 0));

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const [cartResponse, profileResponse] = await Promise.all([
        api.get("/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        api.get("/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      setCart(Array.isArray(cartResponse.data.cart) ? cartResponse.data.cart : []);
      setUser(profileResponse.data.user || null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = useMemo(() => {
    return cart.reduce(
      (total, item) => total + Number(item.book.price || 0) * Number(item.quantity || 0),
      0,
    );
  }, [cart]);

  const totalItems = useMemo(() => {
    return cart.reduce((total, item) => total + Number(item.quantity || 0), 0);
  }, [cart]);

  const confirmOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!user?.address?.fullName) {
        toast.error("Please add your delivery address first");
        return;
      }

      if (cart.length === 0) {
        toast.error("Your cart is empty");
        return;
      }

      setPlacingOrder(true);

      const response = await api.post(
        "/cart/checkout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(response.data.message || "Order placed successfully");
      navigate("/orders");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container checkout-page">
      <div className="checkout-hero">
        <span className="checkout-badge">Secure Checkout</span>

        <h1>Review your order</h1>

        <p>Confirm your selected books and delivery details before placing the order.</p>
      </div>

      {cart.length === 0 ? (
        <div className="checkout-empty">
          <div className="checkout-empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add a few books to continue with checkout.</p>
          <Link to="/books" className="checkout-empty-btn">
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="checkout-layout">
          <div className="checkout-items-card">
            <div className="section-head">
              <div>
                <span className="section-kicker">Order Items</span>
                <h2>{totalItems} item{totalItems === 1 ? "" : "s"} in your cart</h2>
              </div>
            </div>

            <div className="checkout-items-list">
              {cart.map((item) => (
                <div key={item.book._id} className="checkout-item">
                  <Link to={`/book/${item.book._id}`} className="checkout-item-link">
                    <img
                      src={item.book.imageUrl}
                      alt={item.book.title}
                      className="checkout-item-image"
                    />
                  </Link>

                  <div className="checkout-item-info">
                    <Link to={`/book/${item.book._id}`} className="checkout-item-title">
                      {item.book.title}
                    </Link>

                    <p className="checkout-item-author">{item.book.author}</p>

                    <div className="checkout-item-meta">
                      <span className="checkout-qty">Qty: {item.quantity}</span>
                      <span className="checkout-item-price">
                        ₹{formatPrice(Number(item.book.price || 0) * Number(item.quantity || 0))}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="checkout-summary-card">
            <div className="summary-head">
              <span className="section-kicker">Delivery Details</span>
              <h2>Shipping address</h2>
            </div>

            {user?.address?.fullName ? (
              <div className="address-card">
                <p className="address-name">{user.address.fullName}</p>
                <p>{user.address.phone}</p>
                <p>{user.address.addressLine}</p>
                <p>
                  {user.address.city}, {user.address.state}
                </p>
                <p>{user.address.pincode}</p>
              </div>
            ) : (
              <div className="address-empty">
                No address found. Please update your profile before placing the order.
              </div>
            )}

            <div className="summary-box">
              <div className="summary-row">
                <span>Books</span>
                <strong>{totalItems}</strong>
              </div>

              <div className="summary-row">
                <span>Subtotal</span>
                <strong>₹{formatPrice(totalPrice)}</strong>
              </div>

              <div className="summary-row">
                <span>Delivery</span>
                <strong>Free</strong>
              </div>

              <div className="summary-row total">
                <span>Total Amount</span>
                <strong>₹{formatPrice(totalPrice)}</strong>
              </div>
            </div>

            <button
              className="confirm-order-btn"
              onClick={confirmOrder}
              disabled={placingOrder || !user?.address?.fullName}
            >
              {placingOrder ? "Placing Order..." : "Confirm Order"}
            </button>

            
          </aside>
        </div>
      )}
    </div>
  );
}

export default Checkout;