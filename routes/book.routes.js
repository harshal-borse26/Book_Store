import express from "express";
import { addBook, getAllBooks, getBookById } from "../controller/book.controller.js";
import {upload} from "../middleware/upload.middleware.js"
import { protectRoute, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/addbook",protectRoute,isAdmin,upload.single("image"),addBook)
router.get("/", getAllBooks)
router.get("/:id", getBookById)

export default router;