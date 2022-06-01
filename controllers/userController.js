import asyncHandler from "express-async-handler";
import connectDB from "../config/db.js";
import bcrypt from "bcryptjs";
import generateToken from "../utills/generateToken.js";

// ------------------------------------------------------
// @desc    Auth user & get token
// @route   GET /api/users/login

const authUser = asyncHandler(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
  res.setHeader("Access-Control-Allow-Headers", "*");

  const { email, password } = req.body;

  let sql = "SELECT * FROM user WHERE email = ?";

  connectDB.query(sql, email, async function databaseQueryFunc(err, rows) {
    if (rows?.length) {
      var userHashedPassword = rows[0].password;

      if (await matchPassword(password, userHashedPassword)) {
        return res.status(200).json({
          code: 200,
          status: "Success",
          msg: "Passed",
          data: {
            user_id: rows[0].user_id,
            email: rows[0].email,
            password: rows[0].password,
            token: generateToken(rows[0].user_id),
          },
        });

        // res.status(200);
        // res.json({
        //   code: 200,
        //   status: "Success",
        //   msg: "Passed",
        //   data: {
        //     id: rows[0].id,
        //     username: rows[0].username,
        //     password: rows[0].password,
        //     token: generateToken(rows[0].id),
        //   },
        // });
        // res.json({
        //   id: rows[0].id,
        //   username: rows[0].username,
        //   password: rows[0].password,
        //   token: generateToken(rows[0].id),
        // });
      } else {
        res.status(401);
        res.json({ status: "failed", msg: "Invalid email or password" });
        // throw new Error("Invalid email or password");
      }
    } else {
      res.status(401);
      res.json({ status: "failed", msg: "Invalid email or password" });
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
  let sql = "SELECT * FROM user WHERE user_id = ?";
  connectDB.query(
    sql,
    [req.user.id],
    async function databaseQueryFunc(err, rows) {
      if (rows) {
        res.json({
          user_id: rows[0].user_id,
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
  let sql = "SELECT * FROM user WHERE user_id = ?";
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
