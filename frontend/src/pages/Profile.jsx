import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

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

  /* ==========================
      Reading Overview State
  ========================== */

  const [readingStats, setReadingStats] = useState({
    currentlyReading: 0,
    completed: 0,
    pagesRead: 0,
    streak: 0,
    averageProgress: 0,
    notes: 0,
    highlights: 0,
    dailyGoal: 25,
  });

  const [currentBook, setCurrentBook] = useState(null);

  useEffect(() => {
    fetchProfile();
    fetchReadingJourney();
  }, []);

  /* ==========================
        PROFILE API
  ========================== */

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const profile = response.data.user;

      setUser(profile);

      if (profile.address) {
        setAddress(profile.address);
      }
    } catch (error) {
      console.error(error);
    }
  };

  /* ==========================
      READING JOURNEY API
  ========================== */

  const fetchReadingJourney = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/reading-journey", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const books = response.data.books || [];

      let pages = 0;
      let completed = 0;
      let reading = 0;
      let notes = 0;
      let highlights = 0;
      let progress = 0;

      books.forEach((book) => {
        pages += Number(book.currentPage || 0);

        progress += Number(book.progress || 0);

        notes += book.notes ? book.notes.length : 0;

        highlights += book.highlights
          ? book.highlights.length
          : 0;

        if (book.status === "completed") {
          completed++;
        }

        if (book.status === "reading") {
          reading++;
        }
      });

      setReadingStats({
        currentlyReading: reading,
        completed,
        pagesRead: pages,
        streak: 14,
        averageProgress:
          books.length > 0
            ? Math.round(progress / books.length)
            : 0,
        notes,
        highlights,
        dailyGoal: 25,
      });

      const activeBook = books.find(
        (book) => book.status === "reading"
      );

      if (activeBook) {
        setCurrentBook(activeBook);
      }
    } catch (error) {
      console.log(error);
    }
  };

  /* ==========================
      FORM FUNCTIONS
  ========================== */

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const saveAddress = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.put(
        "/profile/address",
        address,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message);
    } catch (error) {
      toast.error("Unable to save address");
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

      {/* =========================
              PAGE HEADER
      ========================== */}

      <div className="profile-header">

        <span className="profile-tag">
          My Account
        </span>

        <h1>
          Welcome back,
          <span> {user.username}</span>
        </h1>

        <p>
          Manage your personal information, monitor your reading activity and
          access everything from one place.
        </p>

      </div>

      {/* =========================
          PROFILE + ADDRESS
      ========================== */}

      <div className="profile-top-section">

        {/* LEFT CARD */}

        <div className="profile-card">

          <div className="profile-avatar">

            {user.username.charAt(0).toUpperCase()}

          </div>

          <h2>
            {user.username}
          </h2>

          <p className="profile-email">
            {user.email}
          </p>

          <div className="profile-stats">

            <div className="profile-stat">

              <h3>
                {user.orders?.length || 0}
              </h3>

              <span>
                Orders
              </span>

            </div>

            <div className="profile-stat">

              <h3>
                {user.wishlist?.length || 0}
              </h3>

              <span>
                Wishlist
              </span>

            </div>

            <div className="profile-stat">

              <h3>
                {readingStats.completed}
              </h3>

              <span>
                Books Finished
              </span>

            </div>

          </div>

        </div>

        {/* RIGHT CARD */}

        <div className="address-card">

          <div className="section-heading">

            <h2>
              Personal Information
            </h2>

            <p>
              Update your delivery address and contact information.
            </p>

          </div>

          <div className="info-preview">

            <div className="info-item">

              <span>Name</span>

              <strong>{user.username}</strong>

            </div>

            <div className="info-item">

              <span>Email</span>

              <strong>{user.email}</strong>

            </div>

          </div>

          <div className="address-grid">

            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={address.fullName}
              onChange={handleChange}
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={address.phone}
              onChange={handleChange}
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={address.city}
              onChange={handleChange}
            />

            <input
              type="text"
              name="state"
              placeholder="State"
              value={address.state}
              onChange={handleChange}
            />

            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={address.pincode}
              onChange={handleChange}
            />

          </div>

          <textarea
            name="addressLine"
            placeholder="Complete Address"
            value={address.addressLine}
            onChange={handleChange}
          />

          <button
            className="save-address-btn"
            onClick={saveAddress}
          >
            Save Address
          </button>

        </div>

      </div>
            {/* =========================
          READING OVERVIEW
      ========================== */}

      <section className="profile-section">

        <div className="section-heading">

          <h2>Reading Overview</h2>

          <p>
            A quick summary of your reading journey.
          </p>

        </div>

        <div className="quick-actions-grid">

          <div className="quick-card">

            <div className="quick-icon">📖</div>

            <h3>{readingStats.currentlyReading}</h3>

            <p>Currently Reading</p>

          </div>

          <div className="quick-card">

            <div className="quick-icon">📚</div>

            <h3>{readingStats.completed}</h3>

            <p>Completed Books</p>

          </div>

          <div className="quick-card">

            <div className="quick-icon">📄</div>

            <h3>{readingStats.pagesRead}</h3>

            <p>Pages Read</p>

          </div>

          <div className="quick-card">

            <div className="quick-icon">🔥</div>

            <h3>{readingStats.streak}</h3>

            <p>Reading Streak</p>

          </div>

        </div>

      </section>

      {/* =========================
          READING ANALYTICS
      ========================== */}

      <section className="profile-section">

        <div className="section-heading">

          <h2>Reading Analytics</h2>

          <p>
            Your overall reading performance.
          </p>

        </div>

        <div className="quick-actions-grid">

          <div className="quick-card">

            <div className="quick-icon">📈</div>

            <h3>{readingStats.averageProgress}%</h3>

            <p>Average Progress</p>

          </div>

          <div className="quick-card">

            <div className="quick-icon">🎯</div>

            <h3>{readingStats.dailyGoal}</h3>

            <p>Daily Goal</p>

          </div>

          <div className="quick-card">

            <div className="quick-icon">📝</div>

            <h3>{readingStats.notes}</h3>

            <p>Notes Written</p>

          </div>

          <div className="quick-card">

            <div className="quick-icon">⭐</div>

            <h3>{readingStats.highlights}</h3>

            <p>Highlights</p>

          </div>

        </div>

      </section>

      {/* =========================
          CONTINUE READING
      ========================== */}

      {currentBook && (

        <section className="profile-section">

          <div className="section-heading">

            <h2>Continue Reading</h2>

            <p>
              Pick up where you left off.
            </p>

          </div>

          <div className="dashboard-placeholder">

            <div className="dashboard-icon">
              📖
            </div>

            <h3>
              {currentBook.title}
            </h3>

            <p>

              Page {currentBook.currentPage || 0}

              {currentBook.totalPages
                ? ` / ${currentBook.totalPages}`
                : ""}

            </p>

            <div
              style={{
                width: "100%",
                height: "12px",
                background: "#ececec",
                borderRadius: "20px",
                overflow: "hidden",
                margin: "25px 0",
              }}
            >

              <div
                style={{
                  width: `${currentBook.progress || 0}%`,
                  height: "100%",
                  background: "#d29b45",
                  borderRadius: "20px",
                }}
              />

            </div>

            <Link
              to="/reading-journey"
              className="save-address-btn"
              style={{
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
                maxWidth: "280px",
                margin: "auto",
                textDecoration: "none",
              }}
            >

              Continue Reading

            </Link>

          </div>

        </section>

      )}

      {/* =========================
          QUICK ACTIONS
      ========================== */}

      <section className="profile-section">

        <div className="section-heading">

          <h2>Quick Actions</h2>

          <p>
            Access your most used sections.
          </p>

        </div>

        <div className="quick-actions-grid">

          <Link
            to="/orders"
            className="quick-card"
          >

            <div className="quick-icon">
              📦
            </div>

            <h3>Orders</h3>

            <p>
              View all purchased books.
            </p>

          </Link>

          <Link
            to="/wishlist"
            className="quick-card"
          >

            <div className="quick-icon">
              ❤️
            </div>

            <h3>Wishlist</h3>

            <p>
              Books saved for later.
            </p>

          </Link>

          <Link
            to="/reading-journey"
            className="quick-card"
          >

            <div className="quick-icon">
              📖
            </div>

            <h3>Reading Journey</h3>

            <p>
              Track your reading progress.
            </p>

          </Link>

          <Link
            to="/books"
            className="quick-card"
          >

            <div className="quick-icon">
              📚
            </div>

            <h3>Browse Books</h3>

            <p>
              Explore the complete collection.
            </p>

          </Link>

        </div>

      </section>

    </div>
  );
}

export default Profile;