import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

import connectDB from "../config/db.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, "shhh");

      console.log(decoded);

      //   req.user = await User.findById(decoded.id).select("-password");
      let sql = "SELECT * FROM user WHERE id = ?";
      connectDB.query(
        sql,
        decoded.id,
        async function databaseQueryFunc(err, rows) {
          console.log(rows);
          req.user = rows;
          //   console.log("Req.user", req.user);
        }
      );

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export { protect };
