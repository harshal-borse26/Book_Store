import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";

function AdminDashboard() {

  const [stats, setStats] = useState(null);

  useEffect(() => {

    fetchStats();

  }, []);

  const fetchStats = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response =
        await api.get(
          "/admin/dashboard",
          {
            headers: {
              Authorization:
              `Bearer ${token}`
            }
          }
        );

      setStats(
        response.data
      );

    } catch (error) {

      console.error(error);

    }

  };

  if (!stats) {
    return <Loader />;
  }

  return (

    <div className="container admin-dashboard">

      <div className="orders-header">

        <h1>
          Admin Dashboard
        </h1>

        <p>
          Store overview and analytics
        </p>

      </div>

      <div className="dashboard-grid">

        <div className="dashboard-card">

          <h2>
            👥 Users
          </h2>

          <h1>
            {stats.totalUsers}
          </h1>

        </div>

        <div className="dashboard-card">

          <h2>
            📚 Books
          </h2>

          <h1>
            {stats.totalBooks}
          </h1>

        </div>

        <div className="dashboard-card">

          <h2>
            📦 Orders
          </h2>

          <h1>
            {stats.totalOrders}
          </h1>

        </div>

        <div className="dashboard-card">

          <h2>
            💰 Revenue
          </h2>

          <h1>
            ₹{stats.totalRevenue}
          </h1>

        </div>

      </div>

    </div>

  );

}

export default AdminDashboard;