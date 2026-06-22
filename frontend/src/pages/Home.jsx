import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-v2 container">
        <div className="hero-content">
          <span className="hero-badge">Trusted by Book Lovers</span>

          <h1>
            Find Your Next
            <span> Great Read</span>
          </h1>

          <p>
            Discover bestselling books, explore world-class authors, and build
            your personal library with ease.
          </p>

          <Link to="/books">
            <button className="hero-btn">Explore Collection</button>
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

          <div className="floating-review">⭐ 4.9 Rating</div>

          <div className="floating-best">🔥 Best Sellers</div>
        </div>
      </section>

      {/* Featured Books */}

      <section className="categories-section">
        <div className="container">
          <div className="section-heading">
            <span>Explore Categories</span>
            <h2>Books For Every Goal</h2>
            <p>
              Curated collections designed to help you learn, grow and stay
              ahead.
            </p>
          </div>

          <div className="categories-grid">
            <div className="category-card">
              <div className="category-icon">💻</div>
              <h3>Programming</h3>
              <p>Master web development and software engineering.</p>
            </div>

            <div className="category-card">
              <div className="category-icon">💰</div>
              <h3>Finance</h3>
              <p>Build wealth and improve money management skills.</p>
            </div>

            <div className="category-card">
              <div className="category-icon">🚀</div>
              <h3>Productivity</h3>
              <p>Learn systems that help you achieve more.</p>
            </div>

            <div className="category-card">
              <div className="category-icon">🧠</div>
              <h3>Self Growth</h3>
              <p>Improve mindset, habits and personal success.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}

      <section className="experience-section">
        <div className="container experience-grid">
          <div className="experience-content">
            <span>Reading Experience</span>

            <h2>More Than A Bookstore</h2>

            <p>
              Discover books that help you build skills, improve your career and
              transform your thinking.
            </p>

            <ul>
              <li>✓ Curated Collection</li>
              <li>✓ Fast Checkout</li>
              <li>✓ Secure Orders</li>
              <li>✓ Personalized Experience</li>
            </ul>
          </div>

          <div className="experience-image">
            <img
              src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da"
              alt="Library"
            />
          </div>
        </div>
      </section>


      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2>Ready To Discover Your Next Favorite Book?</h2>

            <p>
              Browse our growing collection and start building your personal
              library today.
            </p>

            <Link to="/books">
              <button className="hero-btn">Explore Collection</button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <h2>BookStore</h2>

            <p>
              Discover your next favorite book with our growing collection of
              programming, finance, productivity, and self-development titles.
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
          <p>© 2026 BookStore • Built with React, Node.js & MongoDB</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
