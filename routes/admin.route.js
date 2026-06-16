import express from "express";
import { protectRoute, isAdmin  } from "../middleware/auth.middleware.js";

import { getDashboardStats } from "../controller/admin.controller.js";

const router = express.Router();

router.get("/dashboard", protectRoute, isAdmin, getDashboardStats);

export default router;
