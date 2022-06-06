import mysql from "mysql";
import connectDB from "../config/db.js";
import bcrypt from "bcryptjs";

function userModel() {
  var query = "INSERT INTO user (username, password) VALUES ?";
  var values = [
    ["testing@nla.com", bcrypt.hashSync("Possible!#12", 10)],
    ["habib@gmail.com", bcrypt.hashSync("12345", 10)],
  ];
  connectDB.query(query, [values], function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log("Total number of rows inserted =", result.affectedRows);
    }
  });
}

export default userModel;

// User
