function BookCardSkeleton() {
  return (
    <div className="book-card-skeleton">

      <div className="skeleton-cover"></div>

      <div className="skeleton-body">

        <div className="skeleton-line short"></div>

        <div className="skeleton-line"></div>

        <div className="skeleton-line medium"></div>

        <div className="skeleton-footer">

          <div className="skeleton-price"></div>

          <div className="skeleton-btn"></div>

        </div>

      </div>

    </div>
  );
}

export default BookCardSkeleton;