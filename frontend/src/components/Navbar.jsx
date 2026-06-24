import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const location = useLocation();
  useEffect(() => {
  setShowMenu(false);
}, [location]);

  useEffect(() => {
  setMobileMenu(false);
}, [location]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!user) return;

    fetchCounts();

    const updateCounts = () => {
      fetchCounts();
    };

    window.addEventListener("wishlistUpdated", updateCounts);

    return () => window.removeEventListener("wishlistUpdated", updateCounts);
  }, []);

  const fetchCounts = async () => {
    try {
      const token = localStorage.getItem("token");

      const wishlistResponse = await api.get("/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const wishlistData = wishlistResponse.data;

      console.log("Wishlist Data:", wishlistData);

      setWishlistCount(wishlistData.wishlist?.length || 0);

      const cartResponse = await api.get("/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const cartData = cartResponse.data;
      setCartCount(cartData.cart?.length || 0);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");

    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/" className="logo">
          <h2>BookStore</h2>
        </Link>

        <button
          className="mobile-toggle"
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          ☰
        </button>

        <div className={`nav-links ${mobileMenu ? "active" : ""}`}>
          <Link to="/">Home</Link>

          <Link to="/books">Books</Link>

          {!user ? (
            <>
              <Link to="/login">Login</Link>

              <Link to="/register">Register</Link>
            </>
          ) : (
            <>
              <Link to="/wishlist" className="badge-link">
                Wishlist
                {wishlistCount > 0 && (
                  <span className="nav-badge">{wishlistCount}</span>
                )}
              </Link>

              <Link to="/cart" className="badge-link">
                Cart
                {cartCount > 0 && (
                  <span className="nav-badge">{cartCount}</span>
                )}
              </Link>

              <Link to="/journey">Journey</Link>

              {!isMobile ? (
                <div className="user-dropdown">
                  <button
                    className="user-btn"
                    onClick={() => setShowMenu(!showMenu)}
                  >
                    👤 {user.username} ▼
                  </button>

                  {showMenu && (
                    <div className="dropdown-menu">
                      <Link to="/profile" onClick={() => setShowMenu(false)}>
                        Profile
                      </Link>

                      <Link to="/orders" onClick={() => setShowMenu(false)}>
                        Orders
                      </Link>

                      <Link to="/wishlist" onClick={() => setShowMenu(false)}>
                        Wishlist
                      </Link>

                      {user.role === "admin" && (
                        <>
                          <hr />

                          <Link to="/admin">Dashboard</Link>

                          <Link to="/admin/books">Manage Books</Link>

                          <Link to="/admin/orders">Manage Orders</Link>

                          <Link to="/add-book">Add Book</Link>
                        </>
                      )}

                      <hr />

                      <button onClick={handleLogout}>Logout</button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/profile">Profile</Link>

                  <Link to="/orders">Orders</Link>

                  {user.role === "admin" && (
                    <>
                      <Link to="/admin">Dashboard</Link>

                      <Link to="/admin/books">Manage Books</Link>

                      <Link to="/admin/orders">Manage Orders</Link>

                      <Link to="/add-book">Add Book</Link>
                    </>
                  )}

                  <button className="mobile-logout" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
