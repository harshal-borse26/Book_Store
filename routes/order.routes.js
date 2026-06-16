import express from "express";
import {
  getOrderHistory,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} from "../controller/order.controller.js";
import { protectRoute, isAdmin  } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/history", protectRoute, getOrderHistory);

router.get("/all", protectRoute, isAdmin, getAllOrders);

router.put("/status/:orderId", protectRoute, isAdmin, updateOrderStatus);

router.put("/cancel/:id", protectRoute, cancelOrder);
export default router;
