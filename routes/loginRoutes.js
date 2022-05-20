import express from "express";
const router = express.Router();

import connectDB from "../config/db.js";
import userModel from "../models/userModel.js";

import {
  authUser,
  getUserProfile,
  getUsers,
  getUserById,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

// ----------------------------------

router.route("/login").get(authUser);
router.route("/profile").get(protect, getUserProfile);

router.route("/user/login").get(getUsers);
router.route("/user/login/:id").get(getUserById);
router.get("/data", (req, res, next) => {
  userModel();
  res.status(200).send("Login Page");
});

export default router;
