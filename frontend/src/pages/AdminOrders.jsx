import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import "../styles/AdminOrders.css"

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/order/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(response.data.orders);
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.put(
        `/order/status/${orderId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message);

      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const totalOrders = orders.length;

  const placedOrders = orders.filter(
    (order) => order.status === "placed"
  ).length;

  const shippedOrders = orders.filter(
    (order) => order.status === "shipped"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "delivered"
  ).length;

  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, order) => sum + order.totalPrice, 0);
  }, [orders]);

  return (
    <div className="container admin-orders-page">

      {/* ================= HERO ================= */}

      <section className="admin-orders-hero">

        <div className="admin-orders-tag">
          📦 Administration Panel
        </div>

        <h1>
          Manage
          <span> Customer Orders</span>
        </h1>

        <p>
          Track every purchase, update delivery status and manage
          your complete order lifecycle from one dashboard.
        </p>

      </section>

      {/* ================= STATS ================= */}

      <section className="orders-overview-grid">

        <div className="overview-card">
          <div className="overview-icon blue">
            📦
          </div>

          <div>
            <span>Total Orders</span>

            <h2>{totalOrders}</h2>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon orange">
            🟠
          </div>

          <div>
            <span>Placed</span>

            <h2>{placedOrders}</h2>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon purple">
            🚚
          </div>

          <div>
            <span>Shipped</span>

            <h2>{shippedOrders}</h2>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon green">
            ✅
          </div>

          <div>
            <span>Delivered</span>

            <h2>{deliveredOrders}</h2>
          </div>
        </div>

        <div className="overview-card revenue-card">
          <div className="overview-icon gold">
            💰
          </div>

          <div>
            <span>Total Revenue</span>

            <h2>₹{totalRevenue}</h2>
          </div>
        </div>

      </section>

      {/* ================= ORDERS ================= */}

      <section className="admin-orders-list">

        {orders.map((order) => {

          const totalItems = order.books.reduce(
            (sum, item) => sum + item.quantity,
            0
          );

          return (
            <article
              key={order._id}
              className="admin-order-card"
            >

              {/* HEADER */}

              <div className="admin-order-header">

                <div className="customer-block">

                  <div className="customer-avatar">
                    {order.user?.username?.charAt(0).toUpperCase()}
                  </div>

                  <div>

                    <h3>
                      {order.user?.username}
                    </h3>

                    <p>
                      {order.user?.email}
                    </p>

                    <span>
                      Order #
                      {order._id.slice(-8)}
                    </span>

                  </div>

                </div>

                <div className="header-right">

                  <div
                    className={`order-status-badge ${order.status}`}
                  >
                    {order.status}
                  </div>

                  <div className="order-date-admin">
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString()}
                  </div>

                </div>

              </div>

              {/* SUMMARY */}

              <div className="admin-summary-grid">

                <div className="summary-box">
                  <span>Books</span>

                  <strong>
                    {totalItems}
                  </strong>
                </div>

                <div className="summary-box">
                  <span>Total</span>

                  <strong>
                    ₹{order.totalPrice}
                  </strong>
                </div>

                <div className="summary-box">
                  <span>Status</span>

                  <strong className="capitalize">
                    {order.status}
                  </strong>
                </div>

              </div>

              {/* PART 2 STARTS FROM BOOK LIST */}

                            {/* BOOKS */}

              <div className="admin-books-section">

                <div className="section-heading">
                  <h4>Books Ordered</h4>

                  <span>
                    {totalItems} Item
                    {totalItems > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="admin-books-list">

                  {order.books.map((item) => {

                    if (!item.book) {

                      return (
                        <div
                          key={item._id}
                          className="admin-book-item deleted-book"
                        >

                          <div className="deleted-cover">
                            ❌
                          </div>

                          <div className="book-meta">

                            <h5>
                              Deleted Book
                            </h5>

                            <p>
                              Quantity :
                              {" "}
                              {item.quantity}
                            </p>

                          </div>

                        </div>
                      );

                    }

                    return (

                      <div
                        key={item.book._id}
                        className="admin-book-item"
                      >

                        <img
                          src={item.book.imageUrl}
                          alt={item.book.title}
                          className="admin-book-image"
                        />

                        <div className="book-meta">

                          <h5>
                            {item.book.title}
                          </h5>

                          <p>
                            {item.book.author}
                          </p>

                          <span>
                            Quantity :
                            {" "}
                            {item.quantity}
                          </span>

                        </div>

                      </div>

                    );

                  })}

                </div>

              </div>

              {/* DELIVERY ADDRESS */}

              <div className="admin-address-card">

                <div className="section-heading">
                  <h4>
                    Delivery Address
                  </h4>
                </div>

                <div className="address-content">

                  <p>
                    <strong>
                      {order.address?.fullName}
                    </strong>
                  </p>

                  <p>
                    {order.address?.phone}
                  </p>

                  <p>
                    {order.address?.addressLine}
                  </p>

                  <p>
                    {order.address?.city},
                    {" "}
                    {order.address?.state}
                  </p>

                  <p>
                    {order.address?.pincode}
                  </p>

                </div>

              </div>

              {/* TIMELINE */}

              {order.status !== "cancelled" && (

                <div className="admin-progress-section">

                  <h4>
                    Delivery Progress
                  </h4>

                  <div className="order-timeline">

                    <div
                      className={`timeline-step ${
                        ["placed", "shipped", "delivered"].includes(order.status)
                          ? "completed"
                          : ""
                      }`}
                    >
                      <div className="timeline-dot"></div>

                      <span>
                        Placed
                      </span>
                    </div>

                    <div
                      className={`timeline-step ${
                        ["shipped", "delivered"].includes(order.status)
                          ? "completed"
                          : ""
                      }`}
                    >
                      <div className="timeline-dot"></div>

                      <span>
                        Shipped
                      </span>
                    </div>

                    <div
                      className={`timeline-step ${
                        order.status === "delivered"
                          ? "completed"
                          : ""
                      }`}
                    >
                      <div className="timeline-dot"></div>

                      <span>
                        Delivered
                      </span>
                    </div>

                  </div>

                </div>

              )}

              {/* ACTIONS */}

              <div className="admin-order-actions">

                <button
                  className="ship-btn"
                  disabled={
                    order.status === "shipped" ||
                    order.status === "delivered" ||
                    order.status === "cancelled"
                  }
                  onClick={() =>
                    updateStatus(order._id, "shipped")
                  }
                >
                  🚚 Mark as Shipped
                </button>

                <button
                  className="deliver-btn"
                  disabled={
                    order.status === "delivered" ||
                    order.status === "cancelled"
                  }
                  onClick={() =>
                    updateStatus(order._id, "delivered")
                  }
                >
                  ✅ Mark as Delivered
                </button>

              </div>

            </article>

          );

        })}

      </section>

    </div>
  );
}

export default AdminOrders;