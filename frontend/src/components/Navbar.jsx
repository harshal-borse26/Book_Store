import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="container nav-content">

        <Link to="/" className="logo">
          <h2>BookStore</h2>
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/books">Books</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;