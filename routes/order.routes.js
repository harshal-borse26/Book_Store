import express from "express";
import { getOrderHistory,cancelOrder,} from "../controller/order.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/history", protectRoute, getOrderHistory);
router.put("/cancel/:id", protectRoute, cancelOrder);
export default router;