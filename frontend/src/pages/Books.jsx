import { useEffect, useState } from "react";
import api from "../services/api";
import BookCard from "../components/BookCard";
import Loader from "../components/Loader";
import BookCardSkeleton from "../components/BookCardSkeleton";

function Books() {
  const [books, setBooks] = useState([]);
const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
  try {

    setLoading(true);

    const response = await api.get("/books");

    setBooks(response.data.books);

  } catch (error) {

    console.error(error);

  } finally {

    setLoading(false);

  }
};

  let filteredBooks = books.filter((book) => {
    const matchesSearch = book.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesLanguage =
      language === "all" ? true : book.language === language;

    const matchesPrice =
      priceRange === "all"
        ? true
        : priceRange === "below500"
          ? book.price < 500
          : priceRange === "500to1000"
            ? book.price >= 500 && book.price <= 1000
            : book.price > 1000;

    return matchesSearch && matchesLanguage && matchesPrice;
  });

  if (sortBy === "low-high") {
    filteredBooks.sort((a, b) => a.price - b.price);
  }

  if (sortBy === "high-low") {
    filteredBooks.sort((a, b) => b.price - a.price);
  }

  if (sortBy === "rating") {
    filteredBooks.sort((a, b) => b.averageRating - a.averageRating);
  }

  return (
    <div className="container books-page">
      <div className="books-hero">
        <span className="books-tag">Library Collection</span>

        <h1>
          Discover
          <span> Great Books</span>
        </h1>

        <p>
          Explore programming, finance, productivity and self-development books.
        </p>
      </div>


      <div className="filters-wrapper">

  <div className="search-box">
    <input
      type="text"
      placeholder="🔍 Search books, authors..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </div>

  <div className="filter-bar">

    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
    >
      <option value="all"> Language </option>
      <option value="English">English</option>
      <option value="Hindi">Hindi</option>
      <option value="Marathi">Marathi</option>
    </select>

    <select
      value={priceRange}
      onChange={(e) => setPriceRange(e.target.value)}
    >
      <option value="all">Price Range</option>
      <option value="below500">Below ₹500</option>
      <option value="500to1000">₹500 - ₹1000</option>
      <option value="above1000">Above ₹1000</option>
    </select>

    <select
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value)}
    >
      <option value="default">Sort By</option>
      <option value="low-high">Low → High</option>
      <option value="high-low">High → Low</option>
      <option value="rating">Highest Rated</option>
    </select>

  </div>



</div>

      <div className="books-info">
        <div className="book-count">{filteredBooks.length} Books Available</div>
      </div>

      <div className="books-section-header">
        <h2>Available Books</h2>
        <p>Explore our complete collection</p>
      </div>

      <div className="books-grid">

  {loading ? (

    [...Array(8)].map((_, index) => (

      <BookCardSkeleton key={index} />

    ))

  ) : (

    filteredBooks.map((book) => (

      <BookCard key={book._id} book={book} />

    ))

  )}

</div>
    </div>
  );
}

export default Books;
