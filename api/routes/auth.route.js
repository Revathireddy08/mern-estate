import express from "express";
import { google, signin, signout, signup } from "../controllers/auth.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
router.get("/signout", signout);

// ✅ ADD THIS HERE 👇
router.get("/me", verifyToken, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

export default router;