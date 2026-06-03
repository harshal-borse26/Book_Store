import User from "../model/user.model.js";
import Book from "../model/book.model.js";

export const addToWishlist = async (req, res) => {
  try {

    const userId = req.user._id;
    const { bookId } = req.params;

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found"
      });
    }

    const user = await User.findById(userId);

    if (user.wishlist.includes(bookId)) {
      return res.status(400).json({
        success: false,
        message: "Already in wishlist"
      });
    }

    user.wishlist.push(bookId);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Added to wishlist"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};

export const removeFromWishlist = async (req, res) => {
  try {

    const userId = req.user._id;
    const { bookId } = req.params;

    await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          wishlist: bookId
        }
      }
    );

    res.status(200).json({
      success: true,
      message: "Removed from wishlist"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};

export const getWishlist = async (req, res) => {
  try {

    const user = await User.findById(
      req.user._id
    ).populate("wishlist");

    res.status(200).json({
      success: true,
      wishlist: user.wishlist
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};