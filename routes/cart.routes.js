import express from "express";

import {
  addToCart,
  getCart,
  removeFromCart,
  checkoutCart,
  updateQuantity
}
from "../controller/cart.controller.js";

import {
  protectRoute
}
from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/add",
  protectRoute,
  addToCart
);

router.put(
  "/quantity",
  protectRoute,
  updateQuantity
);

router.post(
  "/checkout",
  protectRoute,
  checkoutCart
);

router.get(
  "/",
  protectRoute,
  getCart
);

router.delete(
  "/:bookId",
  protectRoute,
  removeFromCart
);

export default router;
