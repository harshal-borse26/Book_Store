import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";

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
              <div>
                <h3>Order #{order._id.slice(-6)}</h3>

                <p>Total Amount</p>

                <h2>₹{order.totalPrice}</h2>
              </div>

              <span className={`status-pill ${order.status}`}>
                {order.status}
              </span>
            </div>

            <div className="ordered-books">
              {order.book.map((book) => (
                <div key={book._id} className="ordered-book-card">
                  <img
                    src={book.imageUrl}
                    alt={book.title}
                    className="ordered-book-image"
                  />

                  <div className="ordered-book-info">
                    <h3>{book.title}</h3>

                    <p>{book.author}</p>

                    <h4>₹{book.price}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;
