import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

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
              <span className="welcome-user">Welcome, {user.username}</span>

              <Link to="/wishlist">Wishlist</Link>

              <Link to="/orders">My Orders</Link>

              {user.role === "admin" && <Link to="/add-book">Add Book</Link>}

              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
