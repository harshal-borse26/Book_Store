import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

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

      const wishlistResponse = await fetch(
        "http://localhost:3000/api/wishlist",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const wishlistData = await wishlistResponse.json();
      console.log("Wishlist Data:", wishlistData);

      setWishlistCount(wishlistData.wishlist?.length || 0);
      const cartResponse = await fetch("http://localhost:3000/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const cartData = await cartResponse.json();

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

        <div className="nav-links">
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

              <Link to="/orders">Orders</Link>

              {user.role === "admin" && (
                <>
                  <Link to="/admin">Dashboard</Link>
                  <Link to="/admin/orders">Manage Orders</Link>
                  <Link to="/admin/books">Manage Books</Link>
                  <Link to="/add-book">Add Book</Link>
                </>
              )}

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

                    <Link to="/wishlist" onClick={() => setShowMenu(false)}>
                      Wishlist
                    </Link>

                    <Link to="/orders" onClick={() => setShowMenu(false)}>
                      Orders
                    </Link>

                    <button onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
