import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Profile() {
  const [user, setUser] = useState(null);

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data.user);
      if (response.data.user.address) {
        setAddress(response.data.user.address);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const saveAddress = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.put("/profile/address", address, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) {
    return (
      <div className="loader-wrapper">
        <div className="loader"></div>
        <p>Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="container profile-page">
      <div className="profile-card">
        <div className="profile-avatar">👤</div>

        <h1>{user.username}</h1>

        <p>{user.email}</p>

        <div className="profile-stats">
          <div className="profile-stat">
            <h2>{user.orders.length}</h2>
            <span>Orders</span>
          </div>

          <div className="profile-stat">
            <h2>{user.wishlist.length}</h2>
            <span>Wishlist</span>
          </div>

          <div className="profile-stat">
            <h2>{user.role}</h2>
            <span>Role</span>
          </div>
        </div>

        <div className="profile-actions">
          <Link to="/orders" className="profile-action-btn">
            📦 View Orders
          </Link>

          <Link to="/wishlist" className="profile-action-btn">
            ❤️ View Wishlist
          </Link>

          <Link to="/books" className="profile-action-btn">
            📚 Browse Books
          </Link>

          <div className="address-card">
            <h2>Saved Address</h2>

            <div className="address-grid">
              <input
                name="fullName"
                placeholder="Full Name"
                value={address.fullName}
                onChange={handleChange}
              />

              <input
                name="phone"
                placeholder="Phone"
                value={address.phone}
                onChange={handleChange}
              />

              <input
                name="city"
                placeholder="City"
                value={address.city}
                onChange={handleChange}
              />

              <input
                name="state"
                placeholder="State"
                value={address.state}
                onChange={handleChange}
              />

              <input
                name="pincode"
                placeholder="Pincode"
                value={address.pincode}
                onChange={handleChange}
              />
            </div>

            <textarea
              name="addressLine"
              placeholder="Address"
              value={address.addressLine}
              onChange={handleChange}
            />

            <button className="profile-action-btn" onClick={saveAddress}>
              Save Address
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
