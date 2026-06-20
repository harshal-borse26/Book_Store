import Review from "../model/review.model.js";
import Book from "../model/book.model.js";
import Order from "../model/order.model.js";

export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const { bookId } = req.params;
    const purchasedBook = await Order.findOne({
      user: req.user._id,
      "books.book": bookId,
      status: "delivered",
    });

    if (!purchasedBook) {
      return res.status(403).json({
        success: false,
        message: "You can review only purchased books",
      });
    }

    const existingReview = await Review.findOne({
      user: req.user._id,
      book: bookId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this book",
      });
    }

    await Review.create({
      book: bookId,
      user: req.user._id,
      username: req.user.username,
      rating,
      comment,
      verifiedPurchase: true,
    });

    const reviews = await Review.find({
      book: bookId,
    });

    const averageRating =
      reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;

    await Book.findByIdAndUpdate(bookId, {
      averageRating,
      totalReviews: reviews.length,
    });

    res.status(201).json({
      success: true,
      message: "Review added successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getBookReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      book: req.params.bookId,
    })
      .populate("user", "username")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const updateReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.reviewId,
      user: req.user._id,
    });

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    review.rating = req.body.rating;

    review.comment = req.body.comment;

    await review.save();

    res.json({
      success: true,
      message: "Review updated",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const canReviewBook =
  async (req, res) => {

  try {

    const order =
      await Order.findOne({

        user: req.user._id,

        "books.book":
          req.params.bookId,

        status: "delivered",

      });

    res.json({
      success: true,
      canReview: !!order,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }

};