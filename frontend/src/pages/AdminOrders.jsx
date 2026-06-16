import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

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
        },
      );

      toast.success(response.data.message);

      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div className="container orders-page">
      <div className="orders-header">
        <h1>Admin Orders</h1>

        <p>Manage customer orders</p>
      </div>

      {orders.map((order) => (
        <div key={order._id} className="premium-order-card">
          <div className="order-header-new">
            <div>
              <h3>Order #{order._id.slice(-6)}</h3>

              <p>{order.user?.username}</p>

              <p>{order.user?.email}</p>
            </div>

            <span className={`status-pill ${order.status}`}>
              {order.status}
            </span>
          </div>

          <div className="ordered-books">
            {order.books.map((item) => {
              if (!item.book) {
                return (
                  <div key={item._id} className="ordered-book-card">
                    <div className="ordered-book-info">
                      <h3>Deleted Book</h3>

                      <p>Quantity :{item.quantity}</p>
                    </div>
                  </div>
                );
              }

              return (
                <div key={item.book._id} className="ordered-book-card">
                  <img
                    src={item.book.imageUrl}
                    alt={item.book.title}
                    className="ordered-book-image"
                  />

                  <div className="ordered-book-info">
                    <h3>{item.book.title}</h3>

                    <p>Quantity :{item.quantity}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="admin-actions">
            <button onClick={() => updateStatus(order._id, "shipped")}>
              Mark Shipped
            </button>

            <button onClick={() => updateStatus(order._id, "delivered")}>
              Mark Delivered
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminOrders;
