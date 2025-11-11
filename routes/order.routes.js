import express from "express";
import { placeOrder, getOrderHistory } from "../controller/order.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/plaaceorder",protectRoute, placeOrder)
router.get("/history", protectRoute, getOrderHistory);
export default router;