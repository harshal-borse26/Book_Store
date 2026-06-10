import express from "express";
import { getProfile } from "../controller/profile.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { updateAddress } from "../controller/profile.controller.js";

const router = express.Router();

router.put(
  "/address",
  protectRoute,
  updateAddress
);


router.get(
  "/",
  protectRoute,
  getProfile
);

router.put(
  "/address",
  protectRoute,
  updateAddress
);

export default router;