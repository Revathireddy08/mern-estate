import express from "express";
import {
  deleteteUser,
  testing,
  updateUser,
  getUserListing,
  getUser,
} from "../controllers/user.controller.js";

import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// TEST
router.get("/testing", testing);

// UPDATE USER (FIXED: PUT instead of POST)
router.put("/update/:id", verifyToken, updateUser);

// DELETE USER
router.delete("/delete/:id", verifyToken, deleteteUser);

// GET USER LISTINGS
router.get("/listings/:id", verifyToken, getUserListing);

// GET USER PROFILE
router.get("/:id", verifyToken, getUser);

export default router;