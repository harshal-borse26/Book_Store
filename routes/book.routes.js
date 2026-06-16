import express from "express";
import {
  addBook,
  getAllBooks,
  getBookById,
  deleteBook,
  updateBook,
} from "../controller/book.controller.js";
import { upload } from "../middleware/upload.middleware.js";
import { protectRoute, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/addbook", protectRoute, isAdmin, upload.single("image"), addBook);
router.get("/", getAllBooks);
router.get("/:id", getBookById);

router.delete("/:id", protectRoute, isAdmin, deleteBook);

router.put("/:id", protectRoute, isAdmin, updateBook);

export default router;
