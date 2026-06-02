import { useEffect, useState } from "react";
import api from "../services/api";

function Orders() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response = await api.get(
        "/order/history",
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      setOrders(
        response.data.orders
      );

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };

  if (loading) {
    return (
      <div className="container">
        <h2>Loading Orders...</h2>
      </div>
    );
  }

  return (
    <div className="container">

      <h1 className="page-title">
        My Orders
      </h1>

      {
        orders.length === 0 ? (
          <p>No Orders Found</p>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="order-card"
            >

              <h3>
                Order Status:
                {" "}
                {order.status}
              </h3>

              <p>
                Total:
                ₹{order.totalPrice}
              </p>

              {
                order.book.map((book) => (
                  <div
                    key={book._id}
                    className="order-book"
                  >

                    {
                      book.imageUrl && (
                        <img
                          src={book.imageUrl}
                          alt={book.title}
                          className="order-image"
                        />
                      )
                    }

                    <div>
                      <h4>
                        {book.title}
                      </h4>

                      <p>
                        {book.author}
                      </p>

                      <p>
                        ₹{book.price}
                      </p>
                    </div>

                  </div>
                ))
              }

            </div>
          ))
        )
      }

    </div>
  );
}

export default Orders;