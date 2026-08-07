import express from "express";
import {
  addBook,
  getAllBooks,
  getBookById,
  deleteBook,
  updateBook,
  getRecommendedBooks,
} from "../controller/book.controller.js";
import { upload } from "../middleware/upload.middleware.js";
import { protectRoute, isAdmin } from "../middleware/auth.middleware.js";
import {
  addReview,
  getBookReviews,
  canReviewBook,
} from "../controller/review.controller.js";

const router = express.Router();

router.post("/addbook", protectRoute, isAdmin, upload.single("image"), addBook);
router.get("/", getAllBooks);
router.post("/:bookId/review", protectRoute, addReview);
router.get("/:bookId/reviews", getBookReviews);
router.get("/:bookId/can-review", protectRoute, canReviewBook);
router.get("/:id/recommendations", getRecommendedBooks);
router.get("/:id", getBookById);
router.delete("/:id", protectRoute, isAdmin, deleteBook);
// router.put("/:id", protectRoute, isAdmin, updateBook);
router.put(
  "/:id",
  protectRoute,
  isAdmin,
  upload.single("image"),
  updateBook
);
export default router;
