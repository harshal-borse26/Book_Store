import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="container">
      <section className="hero">
        <h1>Discover Your Next Favorite Book</h1>

        <p>
          Browse books, explore new authors, and
          build your personal collection.
        </p>

        <Link to="/books">
          <button className="hero-btn">
            Explore Books
          </button>
        </Link>
      </section>
    </div>
  );
}

export default Home;