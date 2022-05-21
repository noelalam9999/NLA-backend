import asyncHandler from "express-async-handler";
import connectDB from "../config/db.js";
import bcrypt from "bcryptjs";
import generateToken from "../utills/generateToken.js";

// --------------------------------------------------------
// @desc    Auth user & get token
// @route   GET /api/users/login

const authUser = asyncHandler(async (req, res) => {
  // res.setHeader(
  //   "Access-Control-Allow-Origin",
  //   "https://nla-backend.herokuapp.com"
  // );
  // res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
  // res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const { username, password } = req.body;

  let sql = "SELECT * FROM user WHERE username = ?";

  connectDB.query(sql, username, async function databaseQueryFunc(err, rows) {
    if (rows) {
      var userHashedPassword = rows[0].password;
      //   res.send(userPassword);
      if (await matchPassword(password, userHashedPassword)) {
        res.json({
          id: rows[0].id,
          username: rows[0].username,
          password: rows[0].password,
          token: generateToken(rows[0].id),
        });
      } else {
        res.status(401);
        throw new Error("Invalid username or password");
      }
    }
  });

  // res.send({
  //   username,
  //   password,
  // });
});

async function matchPassword(enteredPassword, hashed_pass) {
  console.log("Valid: ", await bcrypt.compare(enteredPassword, hashed_pass));
  return await bcrypt.compare(enteredPassword, hashed_pass);
}

// -----------------------------------------------------------------------------------------
// @desc    Get user profile
// @route   GET /api/users/profile

const getUserProfile = asyncHandler(async (req, res) => {
  //   userID = req.user.id;
  //   console.log("before sql", req.user.id);
  let sql = "SELECT * FROM user WHERE id = ?";
  connectDB.query(
    sql,
    [req.user.id],
    async function databaseQueryFunc(err, rows) {
      if (rows) {
        res.json({
          id: rows[0].id,
          username: rows[0].username,
          password: rows[0].password,
        });
      } else {
        res.status(404);
        throw new Error("User not found");
      }
    }
  );
  res.send("results");
});

// -----------------------------------------------------------------------------------------

// @desc    Fecth all users
// @route   GET /api/users

const getUsers = asyncHandler(async (req, res) => {
  let sql = "SELECT * FROM USER";
  connectDB.query(sql, function (err, results) {
    if (err) throw err;
    res.send(results);
  });
});

// @desc    Fecth a user
// @route   GET /api/users/id

const getUserById = asyncHandler(async (req, res) => {
  let sql = "SELECT * FROM user WHERE id = ?";
  connectDB.query(sql, [req.params.id], function (err, rows) {
    if (err) {
      throw err;
    } else {
      res.send(rows);
      //   res.send(rows[0].password);
      //   console.log("Hey", rows[0].id);
    }
  });
});

export { authUser, getUserProfile, getUsers, getUserById };
