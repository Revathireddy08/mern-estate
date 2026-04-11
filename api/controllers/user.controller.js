import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const testing = (req, res) => {
  res.json({
    message: "Every programmer is an Author!",
  });
};

// ---------------- UPDATE USER ----------------
export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account!"));

  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          ...(req.body.password && { password: req.body.password }),
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return next(errorHandler(404, "User not found"));
    }

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// ---------------- DELETE USER ----------------
export const deleteteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can only delete your own account"));
  }

  try {
    const deleted = await User.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return next(errorHandler(404, "User not found"));
    }

    res.clearCookie("access_token");
    res.status(200).json({
      success: true,
      message: "User has been deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ---------------- GET USER LISTINGS (FIXED) ----------------
export const getUserListing = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // optional safety check (NOT blocking)
    if (!userId) {
      return next(errorHandler(400, "User ID missing"));
    }

    const listings = await Listing.find({ userRef: userId }).sort({
      createdAt: -1,
    });

    return res.status(200).json(listings || []);
  } catch (error) {
    console.log("getUserListing error:", error.message);
    next(error);
  }
};

// ---------------- GET USER ----------------
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return next(errorHandler(404, "User Not Found"));

    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};