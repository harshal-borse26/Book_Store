import { Link } from "react-router-dom";

function Home() {
  return (
    <div>

      {/* Hero Section */}
      <section className="hero-v2 container">

        <div className="hero-content">

          <span className="hero-badge">
            📚 Trusted by Book Lovers
          </span>

          <h1>
            Find Your Next
            <span> Great Read</span>
          </h1>

          <p>
            Discover bestselling books, explore
            world-class authors, and build your
            personal library with ease.
          </p>

          <Link to="/books">
            <button className="hero-btn">
              Explore Collection
            </button>
          </Link>

          <div className="hero-stats">

            <div>
              <h3>500+</h3>
              <p>Books</p>
            </div>

            <div>
              <h3>100+</h3>
              <p>Authors</p>
            </div>

            <div>
              <h3>1000+</h3>
              <p>Readers</p>
            </div>

          </div>

        </div>

        <div className="hero-image-area">

          <div className="hero-main-book">
            <img
              src="https://images.unsplash.com/photo-1544947950-fa07a98d237f"
              alt="Book"
            />
          </div>

          <div className="floating-review">
            ⭐ 4.9 Rating
          </div>

          <div className="floating-best">
            🔥 Best Sellers
          </div>

        </div>

      </section>

      {/* Featured Books */}

      <section className="featured-section">

        <div className="container">

          <h2>Featured Books</h2>

          <p>
            Explore our most popular books.
          </p>

          <div className="featured-grid">

            <div className="feature-card">
              📖 Self Development
            </div>

            <div className="feature-card">
              💰 Finance
            </div>

            <div className="feature-card">
              💻 Programming
            </div>

            <div className="feature-card">
              🚀 Productivity
            </div>

          </div>

        </div>

      </section>

      {/* Why Choose Us */}

      <section className="why-section">

        <div className="container">

          <h2>Why Readers Love Us</h2>

          <div className="why-grid">

            <div className="why-card">
              📚
              <h3>Wide Collection</h3>
              <p>
                Discover books from every genre.
              </p>
            </div>

            <div className="why-card">
              ⚡
              <h3>Fast Experience</h3>
              <p>
                Simple and smooth browsing.
              </p>
            </div>

            <div className="why-card">
              🔒
              <h3>Secure Orders</h3>
              <p>
                Protected login and ordering.
              </p>
            </div>

          </div>

        </div>

      </section>

      <footer className="footer">

  <div className="footer-container">

    <div className="footer-brand">

      <h2>📚 BookStore</h2>

      <p>
        Discover your next favorite book with our
        growing collection of programming,
        finance, productivity, and self-development
        titles.
      </p>

    </div>

    <div className="footer-section">

      <h4>Quick Links</h4>

      <a href="/">Home</a>
      <a href="/books">Books</a>
      <a href="/orders">My Orders</a>

    </div>

    <div className="footer-section">

      <h4>Contact</h4>

      <p>support@bookstore.com</p>
      <p>Available 24/7</p>

    </div>

  </div>

  <div className="footer-bottom">

    <p>
      © 2026 BookStore • Built with React,
      Node.js & MongoDB
    </p>

  </div>

</footer>

    </div>
  );
}

export default Home;