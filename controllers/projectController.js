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

// @desc    Fecth projects with project id
// @route   GET /api/project/project_id

const getProjectByProjectId = asyncHandler(async (req, res) => {
  let sql = "SELECT * FROM project WHERE project_id = ?";
  connectDB.query(sql, [req.params.project_id], function (err, rows) {
    if (err) {
      throw err;
    } else {
      res.send(rows);
    }
  });
});

// @desc    Fecth projects with user id
// @route   GET /api/project/user_id

const getProjectByUserId = asyncHandler(async (req, res) => {
  const resultsPerPage = 5;
  let sql =
    "SELECT * FROM project WHERE user_id = ? ORDER BY date_created DESC";
  connectDB.query(sql, [req.params.id], function (err, rows) {
    if (err) {
      throw err;
    } else {
      const numberOfResults = rows.length;
      const numberOfPages = Math.ceil(numberOfResults / resultsPerPage);
      let page = req.query.page ? Number(req.query.page) : 1;
      if (page > numberOfPages) {
        res.send("/?page=" + encodeURIComponent(numberOfPages));
      } else if (page < 1) {
        res.send("/?page=" + encodeURIComponent("1"));
      }

      const startingLimit = (page - 1) * resultsPerPage;

      let sql = `SELECT * FROM project WHERE user_id = ? ORDER BY date_created DESC LIMIT ${startingLimit}, ${resultsPerPage}`;

      connectDB.query(sql, [req.params.id], function (err, rows) {
        if (err) {
          throw err;
        } else {
          if (err) throw err;
          let iterator = page - 5 < 1 ? 1 : page - 5;
          let endingLink =
            iterator + 9 <= numberOfPages
              ? iterator + 9
              : page + (numberOfPages - page);

          if (endingLink < page + 4) {
            iterator -= page + 4 - numberOfPages;
          }
          // res.render('index', {data: result, page, iterator, endingLink, numberOfPages});
          // res.send({ data: rows, page, iterator, endingLink, numberOfPages });
          const data = {
            page,
            iterator,
            endingLink,
            numberOfPages,
          };
          res.send({
            rows: rows,
            pagination: data,
          });
          // res.send(rows);
        }
      });

      // res.send(rows);
    }
  });
});

// @desc    Fecth projects with Project Name
// @route   POST /api/project/project_name

const getProjectByName = asyncHandler(async (req, res) => {
  const resultsPerPage = 5;

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS,DELETE,PUT");
  res.setHeader("Access-Control-Allow-Headers", "*");

  const { user_id, project_name } = req.body;

  // let sql = `SELECT * FROM project WHERE project_name LIKE '%${project_name}%'`;
  let sql = `SELECT * FROM project WHERE user_id = '${user_id}' AND project_name LIKE '%${project_name}%' ORDER BY date_created DESC`;

  connectDB.query(sql, function (err, rows) {
    if (err) {
      throw err;
    } else {
      if (!rows?.length) {
        res.json({ status: "failed", msg: "No record found" });
      } else {
        const numOfResults = rows.length;
        const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
        let page = req.query.page ? Number(req.query.page) : 1;
        if (page > numberOfPages) {
          res.redirect("/?page=" + encodeURIComponent(numberOfPages));
        } else if (page < 1) {
          res.redirect("/?page=" + encodeURIComponent("1"));
        }
        // res.send(rows);

        const startingLimit = (page - 1) * resultsPerPage;

        let sql = `SELECT * FROM project WHERE user_id = '${user_id}' AND project_name LIKE '%${project_name}%' ORDER BY date_created DESC LIMIT ${startingLimit}, ${resultsPerPage}`;

        connectDB.query(sql, function (err, rows) {
          if (err) {
            throw err;
          } else {
            if (err) throw err;
            let iterator = page - 5 < 1 ? 1 : page - 5;
            let endingLink =
              iterator + 9 <= numberOfPages
                ? iterator + 9
                : page + (numberOfPages - page);

            if (endingLink < page + 4) {
              iterator -= page + 4 - numberOfPages;
            }
            // res.render('index', {data: result, page, iterator, endingLink, numberOfPages});
            // res.send({ data: rows, page, iterator, endingLink, numberOfPages });
            const data = {
              page,
              iterator,
              endingLink,
              numberOfPages,
            };
            res.send({
              rows: rows,
              pagination: data,
            });
            // res.send(rows);
          }
        });
      }
    }
  });
});

// @desc    Filter projects with date
// @route   POST /api/project/date

const getProjectByDate = asyncHandler(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS,DELETE,PUT");
  res.setHeader("Access-Control-Allow-Headers", "*");

  const { project_date, user_id } = req.body;

  // let sql = "SELECT * FROM project WHERE DATE(date_created) = ?";
  // let sql = `SELECT * FROM project WHERE DATE(date_created) LIKE '%${project_date}%'`;
  let sql = `SELECT * FROM project WHERE user_id = '${user_id}' AND DATE(date_created) LIKE '%${project_date}%' ORDER BY date_created DESC`;

  connectDB.query(sql, function (err, rows) {
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

// @desc    Filter projects with date and Name
// @route   POST /api/project/search

const getProjectByDateAndName = asyncHandler(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS,DELETE,PUT");
  res.setHeader("Access-Control-Allow-Headers", "*");

  const { user_id, project_name, project_date } = req.body;

  // let sql = `SELECT * FROM project WHERE project_name LIKE '%${project_name}%' AND DATE(date_created) LIKE '%${project_date}%'`;
  let sql = `SELECT * FROM project WHERE user_id = '${user_id}' AND project_name LIKE '%${project_name}%' AND DATE(date_created) LIKE '%${project_date}%' ORDER BY date_created DESC`;

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

// =============================================================================== Getting Projects (Pinned and Unpinned)

// @desc    GET pinned Projects
// @route   POST /api/project/pinned

const getPinnedProjects = asyncHandler(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS,DELETE,PUT");
  res.setHeader("Access-Control-Allow-Headers", "*");

  let sql = "SELECT * FROM project WHERE pin_project = 1";
  connectDB.query(sql, function (err, rows) {
    if (err) {
      throw err;
    } else {
      if (!rows?.length) {
        res.json({ status: "failed", msg: "No record found" });
      } else {
        res.send(rows);
      }
    }
  });
});

// @desc    Filter Unpinned Projects
// @route   POST /api/project/unpinned

const getUnPinnedProjects = asyncHandler(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS,DELETE,PUT");
  res.setHeader("Access-Control-Allow-Headers", "*");

  let sql = "SELECT * FROM project WHERE pin_project = 0";
  connectDB.query(sql, function (err, rows) {
    if (err) {
      throw err;
    } else {
      if (!rows?.length) {
        res.json({ status: "failed", msg: "No record found" });
      } else {
        res.send(rows);
      }
    }
  });
});

// @desc    Add a Pinned Project
// @route   POST /api/project/date

const pinOrUnpinProject = asyncHandler(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS,DELETE,PUT");
  res.setHeader("Access-Control-Allow-Headers", "*");

  const { project_id } = req.body;

  let checkSql = "SELECT * FROM project WHERE project_id = ?";

  connectDB.query(checkSql, project_id, function (err, rows) {
    if (err) {
      throw err;
    } else {
      if (!rows?.length) {
        res.json({ status: "failed", msg: "No record found" });
      } else {
        if (rows[0]?.pin_project == 1) {
          // res.json({ status: "failed", msg: "Project is already pinned" });
          let sql = `UPDATE project SET pin_project = 0 WHERE project_id = '${project_id}'`;
          connectDB.query(sql, function (err, rows) {
            if (err) {
              throw err;
            } else {
              res.status(200).send("Unpinned Project Successfully");
            }
          });
        } else if (rows[0]?.pin_project == 0) {
          let sql = `UPDATE project SET pin_project = 1 WHERE project_id = '${project_id}'`;
          connectDB.query(sql, function (err, rows) {
            if (err) {
              throw err;
            } else {
              res.status(200).send("Pinned Project Successfully");
            }
          });
        } else {
          res.json({ status: "failed", msg: "Unable to Pin" });
        }
      }
    }
  });
});

// @desc    Add an UnPinned Project
// @route   POST /api/project/date

const addUnPinnedProject = asyncHandler(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS,DELETE,PUT");
  res.setHeader("Access-Control-Allow-Headers", "*");

  const { project_id } = req.body;

  let checkSql = "SELECT * FROM project WHERE project_id = ?";

  connectDB.query(checkSql, project_id, function (err, rows) {
    if (err) {
      throw err;
    } else {
      if (!rows?.length) {
        res.json({ status: "failed", msg: "No record found" });
      } else {
        if (rows[0]?.pin_project == 0) {
          res.json({ status: "failed", msg: "Project is already unpinned" });
        } else {
          let sql = `UPDATE project SET pin_project = 0 WHERE project_id = '${project_id}'`;
          connectDB.query(sql, function (err, rows) {
            if (err) {
              throw err;
            } else {
              res.status(200).send("Unpinned Project Successfully");
            }
          });
        }
      }
    }
  });
});

// ----------------------------------------------------------------------------------------------------------------------

// @desc    Add a project
// @route   GET /api/add/project

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

// @desc    Edit a project
// @route   GET /api/edit/project

const editProject = asyncHandler(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS,DELETE,PUT");
  res.setHeader("Access-Control-Allow-Headers", "*");
  // console.log("\nreq.file: ", req.file);
  const {
    project_name,
    type_of_project,
    client_name,
    product_name,
    project_id,
  } = req.body;

  const company_logo = req.file.path;
  console.log("\ncompanyLogo: ", company_logo);

  var query = `UPDATE project SET project_name = '${project_name}', type_of_project = '${type_of_project}', client_name = '${client_name}', product_name = '${product_name}', company_logo = '${company_logo}' WHERE project_id = '${project_id}'`;

  connectDB.query(query, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(
        "Project Edited successfully, Total rows inserted =",
        result.affectedRows
      );
      res.status(200).send("Project Edited successfully");
    }
  });
});

// ***********

export {
  addProject,
  editProject,
  pinOrUnpinProject,
  getProjects,
  getProjectByUserId,
  getProjectByProjectId,
  getProjectByName,
  getProjectByDate,
  getProjectByDateAndName,
  getPinnedProjects,
  getUnPinnedProjects,
  addUnPinnedProject,
};
