import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/order/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(response.data.orders);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.put(
        `/order/cancel/${orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(response.data.message);

      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container orders-page">
      <div className="orders-header">
        <h1>My Orders</h1>
        <p>Track all your purchased books</p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <div className="empty-icon">📚</div>

          <h2>No Orders Yet</h2>

          <p>
            Looks like you haven't purchased any books. Start exploring our
            collection and place your first order.
          </p>

          <a href="/books" className="empty-btn">
            Browse Books
          </a>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="premium-order-card">
<div className="order-header-new">

  <div className="order-left">

    <h3>
      Order #{order._id.slice(-6)}
    </h3>

    <p className="order-date">
      {new Date(order.createdAt).toLocaleDateString()}
    </p>

    <div className="order-total">
      ₹{order.totalPrice}
    </div>

  </div>

  <div className="order-right">

    <div
      className={`order-status-badge ${order.status}`}
    >

      {
        order.status === "placed"
          ? "📦 Placed"
          : order.status === "shipped"
          ? "🚚 Shipped"
          : order.status === "delivered"
          ? "✅ Delivered"
          : "❌ Cancelled"
      }

    </div>

    <div className="order-progress">

      <div
        className={`progress-step ${
          ["placed","shipped","delivered"]
          .includes(order.status)
            ? "active"
            : order.status === "cancelled"
            ? "cancelled"
            : ""
        }`}
      />

      <div
        className={`progress-step ${
          ["shipped","delivered"]
          .includes(order.status)
            ? "active"
            : ""
        }`}
      />

      <div
        className={`progress-step ${
          order.status === "delivered"
            ? "active"
            : ""
        }`}
      />

    </div>

    {
      order.status === "placed" && (

        <button
          className="cancel-order-btn"
          onClick={() =>
            cancelOrder(order._id)
          }
        >
          Cancel Order
        </button>

      )
    }

  </div>

</div>
            <div className="order-timeline-card">
              <h4>Order Progress</h4>

              <div className="order-timeline">
                <div
                  className={`timeline-step ${
                    ["placed", "shipped", "delivered"].includes(order.status)
                      ? "completed"
                      : ""
                  }`}
                >
                  <div className="timeline-dot"></div>

                  <span>Order Placed</span>
                </div>

                <div
                  className={`timeline-step ${
                    ["shipped", "delivered"].includes(order.status)
                      ? "completed"
                      : ""
                  }`}
                >
                  <div className="timeline-dot"></div>

                  <span>Shipped</span>
                </div>

                <div
                  className={`timeline-step ${
                    order.status === "delivered" ? "completed" : ""
                  }`}
                >
                  <div className="timeline-dot"></div>

                  <span>Delivered</span>
                </div>
              </div>

              {order.status === "cancelled" && (
                <div className="cancelled-order">❌ Order Cancelled</div>
              )}
            </div>

            <div className="order-section">
              <h4 className="section-title">Books Purchased</h4>

              <div className="ordered-books">
                {order.books
                  .filter((item) => item.book)
                  .map((item) => (
                    <div key={item.book._id} className="ordered-book-card">
                      <img
                        src={item.book?.imageUrl}
                        alt={item.book.title}
                        className="ordered-book-image"
                      />

                      <div className="ordered-book-info">
                        <h3>{item.book.title}</h3>

                        <p>{item.book.author}</p>

                        <p>Quantity: {item.quantity}</p>

                        <h4>₹{item.book.price}</h4>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="order-section">
              <h4 className="section-title">📍 Delivery Address</h4>

              <div className="order-address">
                <p>{order.address?.fullName}</p>

                <p>{order.address?.phone}</p>

                <p>{order.address?.addressLine}</p>

                <p>
                  {order.address?.city}, {order.address?.state}
                </p>

                <p>{order.address?.pincode}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;
