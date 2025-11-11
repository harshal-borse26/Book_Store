import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getBookInsights } from "../controller/ai.controller.js";
const router = express.Router();

router.get("/:bookId", protectRoute, getBookInsights);
export default router;