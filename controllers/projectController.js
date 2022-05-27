import asyncHandler from "express-async-handler";
import connectDB from "../config/db.js";

// -----------------------------------------------------------------------------------------

// @desc    Fecth all projects
// @route   GET /api/projects

const getProjects = asyncHandler(async (req, res) => {
  let sql = "SELECT * FROM PROJECT";
  connectDB.query(sql, function (err, results) {
    if (err) throw err;
    res.send(results);
  });
});

// @desc    Fecth projects with user id
// @route   GET /api/project/user_id

const getProjectByUserId = asyncHandler(async (req, res) => {
  let sql = "SELECT * FROM project WHERE user_id = ?";
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

// @desc    Fecth projects with Project Name
// @route   POST /api/project/project_name

const getProjectByName = asyncHandler(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS,DELETE,PUT");
  res.setHeader("Access-Control-Allow-Headers", "*");

  const { project_name } = req.body;

  let sql = "SELECT * FROM project WHERE project_name = ?";
  connectDB.query(sql, project_name, function (err, rows) {
    if (err) {
      throw err;
    } else {
      if (!rows?.length) {
        res.json({ status: "failed", msg: "No record found" });
      } else {
        res.send(rows);
      }

      // res.send({
      //   project_name,
      // });
    }
  });
});

// @desc    Filter projects with date
// @route   POST /api/project/date

const getProjectByDate = asyncHandler(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS,DELETE,PUT");
  res.setHeader("Access-Control-Allow-Headers", "*");

  const { project_date } = req.body;

  let sql = "SELECT * FROM project WHERE DATE(date_created) = ?";
  connectDB.query(sql, project_date, function (err, rows) {
    if (err) {
      throw err;
    } else {
      if (!rows?.length) {
        res.json({ status: "failed", msg: "No record found" });
      } else {
        res.send(rows);
      }

      // res.send({
      //   project_date,
      // });
    }
  });
});

// @desc    Filter projects with date
// @route   POST /api/project/date

const getProjectByDateAndName = asyncHandler(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS,DELETE,PUT");
  res.setHeader("Access-Control-Allow-Headers", "*");

  const { project_name, project_date } = req.body;

  let sql = `SELECT * FROM project WHERE project_name LIKE '${project_name}' AND DATE(date_created) LIKE '${project_date}'`;
  connectDB.query(sql, function (err, rows) {
    if (err) {
      throw err;
    } else {
      if (!rows?.length) {
        res.json({ status: "failed", msg: "No record found" });
      } else {
        res.send(rows);
        // res.json({ status: "failed", msg: "No record found" });
      }

      // res.send({
      //   project_name,
      // });
    }
  });
});

// @desc    Ada a project
// @route   GET /api/add/projetc

const addProject = asyncHandler(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS,DELETE,PUT");
  res.setHeader("Access-Control-Allow-Headers", "*");
  // console.log("\nreq.file: ", req.file);
  const {
    user_id,
    project_name,
    slug,
    type_of_project,
    client_name,
    product_name,
    project_version,
    pin_project,
  } = req.body;

  const company_logo = req.file.path;
  console.log("\ncompanyLogo: ", company_logo);

  var query =
    "INSERT INTO project (user_id, project_name, slug, type_of_project, client_name, product_name, project_version, company_logo, pin_project) VALUES ?";
  var values = [
    [
      user_id,
      project_name,
      slug,
      type_of_project,
      client_name,
      product_name,
      project_version,
      company_logo,
      pin_project,
    ],
  ];
  connectDB.query(query, [values], function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(
        "Row inserted successfully, Total rows inserted =",
        result.affectedRows
      );
      res.status(200).send("Row inserted successfully");
    }
  });

  //   res.send({
  //     user_id,
  //     project_name,
  //     slug,
  //   });
  //   res.send("I am working");
});

export {
  getProjects,
  getProjectByUserId,
  getProjectByName,
  addProject,
  getProjectByDate,
  getProjectByDateAndName,
};
