import express from "express";

import {
  addToWishlist,
  removeFromWishlist,
  getWishlist
} from "../controller/wishlist.controller.js";

import {
  protectRoute
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/:bookId",
  protectRoute,
  addToWishlist
);

router.delete(
  "/:bookId",
  protectRoute,
  removeFromWishlist
);

router.get(
  "/",
  protectRoute,
  getWishlist
);

export default router;