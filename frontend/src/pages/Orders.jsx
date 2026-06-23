import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(Number(value || 0));

  const formatDate = (value) => {
    if (!value) return "—";
    return new Date(value).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusMeta = (status) => {
    switch (status) {
      case "placed":
        return { label: "Placed", icon: "📦", className: "placed" };
      case "shipped":
        return { label: "Shipped", icon: "🚚", className: "shipped" };
      case "delivered":
        return { label: "Delivered", icon: "✅", className: "delivered" };
      case "cancelled":
        return { label: "Cancelled", icon: "❌", className: "cancelled" };
      default:
        return { label: "Placed", icon: "📦", className: "placed" };
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await api.get("/order/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const list = Array.isArray(response.data.orders)
        ? [...response.data.orders]
        : [];

      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setOrders(list);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      setCancellingId(orderId);

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

      toast.success(response.data.message || "Order cancelled");

      await fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not cancel order");
    } finally {
      setCancellingId(null);
    }
  };

  const stats = useMemo(() => {
    const totalOrders = orders.length;

    const totalBooks = orders.reduce((sum, order) => {
      const items = Array.isArray(order.books) ? order.books : [];
      return (
        sum +
        items.reduce((itemSum, item) => itemSum + Number(item.quantity || 0), 0)
      );
    }, 0);

    const totalSpent = orders.reduce(
      (sum, order) => sum + Number(order.totalPrice || 0),
      0,
    );

    const activeOrders = orders.filter((order) =>
      ["placed", "shipped"].includes(order.status),
    ).length;

    return {
      totalOrders,
      totalBooks,
      totalSpent,
      activeOrders,
    };
  }, [orders]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container orders-page">
      <section className="orders-hero">
        <div className="orders-hero-content">
          <span className="orders-tag">Order History</span>

          <h1>My Orders</h1>

          <p>Track all your purchased books and check their current status.</p>
        </div>

        <div className="orders-stats-grid">
          <div className="orders-stat-card">
            <span>Total Orders</span>
            <strong>{stats.totalOrders}</strong>
          </div>

          <div className="orders-stat-card">
            <span>Books Bought</span>
            <strong>{stats.totalBooks}</strong>
          </div>

          <div className="orders-stat-card">
            <span>Active Orders</span>
            <strong>{stats.activeOrders}</strong>
          </div>

          <div className="orders-stat-card">
            <span>Total Spent</span>
            <strong>₹{formatCurrency(stats.totalSpent)}</strong>
          </div>
        </div>
      </section>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <div className="empty-icon">📚</div>

          <h2>No Orders Yet</h2>

          <p>
            Looks like you have not purchased any books yet. Start exploring our
            collection and place your first order.
          </p>

          <Link to="/books" className="empty-btn">
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="orders-layout">
          <div className="orders-list">
            {orders.map((order) => {
              const statusMeta = getStatusMeta(order.status);
              const books = Array.isArray(order.books)
                ? order.books.filter((item) => item?.book)
                : [];

              return (
                <article key={order._id} className="order-card">
                  <header className="order-card-header">
                    <div className="order-card-left">
                      <span className="order-number">
                        Order #{String(order._id || "").slice(-6).toUpperCase()}
                      </span>

                      <p className="order-date">{formatDate(order.createdAt)}</p>

                      <div className="order-total">₹{formatCurrency(order.totalPrice)}</div>
                    </div>

                    <div className="order-card-right">
                      <span className={`order-status-badge ${statusMeta.className}`}>
                        {statusMeta.icon} {statusMeta.label}
                      </span>

                      {order.status === "placed" && (
                        <button
                          type="button"
                          className="cancel-order-btn"
                          onClick={() => cancelOrder(order._id)}
                          disabled={cancellingId === order._id}
                        >
                          {cancellingId === order._id ? "Cancelling..." : "Cancel Order"}
                        </button>
                      )}
                    </div>
                  </header>

                  {order.status !== "cancelled" ? (

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
          order.status === "delivered"
            ? "completed"
            : ""
        }`}
      >
        <div className="timeline-dot"></div>
        <span>Delivered</span>
      </div>

    </div>

  </div>

) : (

  <div className="cancelled-order">
    ❌ This order has been cancelled
  </div>

)}

                  <div className="order-section">
                    <div className="section-title-row">
                      <h4 className="section-title">Books Purchased</h4>
                      <span className="section-subtitle">
                        {books.length} item{books.length === 1 ? "" : "s"}
                      </span>
                    </div>

                    <div className="ordered-books">
                      {books.map((item) => (
                        <div key={item.book._id} className="ordered-book-card">
                          <Link to={`/book/${item.book._id}`} className="ordered-book-link">
                            <img
                              src={item.book.imageUrl}
                              alt={item.book.title}
                              className="ordered-book-image"
                            />
                          </Link>

                          <div className="ordered-book-info">
                            <Link
                              to={`/book/${item.book._id}`}
                              className="ordered-book-title"
                            >
                              {item.book.title}
                            </Link>

                            <p className="ordered-book-author">{item.book.author}</p>

                            <div className="ordered-book-meta">
                              <span>Quantity: {item.quantity}</span>
                              <strong>₹{formatCurrency(item.book.price)}</strong>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="order-section">
                    <div className="section-title-row">
                      <h4 className="section-title">📍 Delivery Address</h4>
                    </div>

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
                </article>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;