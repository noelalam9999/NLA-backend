import mysql from "mysql";
import connectDB from "../config/db.js";

function userModel() {
  var query = "INSERT INTO project (user_id, project_name, slug ) VALUES ?";
  var values = [
    [
      1,
      "Tayyab's Project 1",
      "project",
      "From Heroku",
      "Hamza",
      "Zopyclone",
      5,
      "image url",
      1,
    ],
    // [1, "Tayyab's Project 2", "project"],
    // [1, "Tayyab's Project 3", "project"],
    // [9, "Habib's Project 1", "project"],
    // [9, "Habib's Project 2", "project"],
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
