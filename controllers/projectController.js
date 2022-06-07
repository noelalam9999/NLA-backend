import asyncHandler from "express-async-handler";
import connectDB from "../config/db.js";

// --------------------------------------------------------------------------------------

// @desc    Fecth all projects
// @route   GET /api/projects

const getProjects = asyncHandler(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS,DELETE,PUT");
  res.setHeader("Access-Control-Allow-Headers", "*");

  // const page = req.query.page ? Number(req.query.page) : 1;
  // const limit = Number(req.query.limit);

  // const startIndex = (page - 1) * limit;
  // const endIndex = page * limit;

  let sql = "SELECT * FROM PROJECT";
  connectDB.query(sql, function (err, rows) {
    if (err) throw err;

    // const data = rows.slice(startIndex, endIndex);
    // res.send(data);
    res.send(rows);
  });
});

// Get Order by Pin ...

// const getProjectsOrderByPin = asyncHandler(async (req, res) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS,DELETE,PUT");
//   res.setHeader("Access-Control-Allow-Headers", "*");

//   // const { project_id } = req.body;

//   let sql = "SELECT * FROM project WHERE user_id = ? ORDER BY pin_project DESC";
//   connectDB.query(sql, [req.params.user_id], function (err, rows) {
//     if (err) {
//       throw err;
//     } else {
//       res.send(rows);
//     }
//   });
// });

const getProjectsOrderByPin = asyncHandler(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS,DELETE,PUT");
  res.setHeader("Access-Control-Allow-Headers", "*");

  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = Number(req.query.limit);

  // console.log("Limit: ", limit);

  // const { project_id } = req.body;

  // let sql = "SELECT * FROM project WHERE user_id = ? ORDER BY pin_project DESC";
  // connectDB.query(sql, [req.params.user_id], function (err, rows) {
  //   if (err) {
  //     throw err;
  //   } else {
  //     res.send(rows);
  //   }
  // });

  //deploy

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  let sql = "SELECT * FROM project WHERE user_id = ? ORDER BY pin_project DESC";
  // let sql = `SELECT * FROM project WHERE user_id = ? ORDER BY pin_project DESC LIMIT ${startIndex}, ${endIndex}`;

  connectDB.query(sql, [req.params.user_id], function (err, rows) {
    if (err) {
      throw err;
    } else {
      const numberOfResults = rows.length;
      // console.log("rows.length: ", rows.length);
      const numberOfPages = Math.ceil(numberOfResults / limit);
      //
      if (page > numberOfPages) {
        res.send("/?page=" + encodeURIComponent(numberOfPages));
      } else if (page < 1) {
        res.send("/?page=" + encodeURIComponent("1"));
      }

      // const startingLimit = (page - 1) * limit;

      const results = {};

      if (endIndex < rows.length) {
        results.next = {
          page: page + 1,
          limit: limit,
        };
      }

      if (startIndex > 0) {
        results.previous = {
          page: page - 1,
          limit: limit,
        };
      }

      // const user_id = req.params.id;

      let sql =
        "SELECT * FROM project WHERE user_id = ? ORDER BY pin_project DESC";

      connectDB.query(sql, [req.params.user_id], function (err, rows) {
        if (err) {
          callback(error, null);
          return;
        } else {
          console.log("ssql: ", rows.length);
          if (err) throw err;
          let iterator = page - 5 < 1 ? 1 : page - 5;
          let endingLink =
            iterator + 9 <= numberOfPages
              ? iterator + 9
              : page + (numberOfPages - page);

          if (endingLink < page + 4) {
            iterator -= page + 4 - numberOfPages;
          }

          const data = {
            page,
            iterator,
            endingLink,
            numberOfPages,
            results,
          };

          const rowsData = rows.slice(startIndex, endIndex);

          res.send({
            rows: rowsData,
            pagination: data,
          });
          // res.send(rows);
        }
      });

      // res.send(rows);
    }
  });
});

// @desc    Fecth projects with project id
// @route   GET /api/project/project_id

const getProjectByProjectId = asyncHandler(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS,DELETE,PUT");
  res.setHeader("Access-Control-Allow-Headers", "*");

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
// deploy

const getProjectByUserId = asyncHandler(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS,DELETE,PUT");
  res.setHeader("Access-Control-Allow-Headers", "*");

  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = Number(req.query.limit);

  let sql =
    "SELECT * FROM project WHERE user_id = ? AND pin_project = 0 ORDER BY date_created DESC";
  connectDB.query(sql, [req.params.id], function (err, rows) {
    if (err) {
      throw err;
    } else {
      const numberOfResults = rows.length;
      const numberOfPages = Math.ceil(numberOfResults / limit);
      //
      if (page > numberOfPages) {
        res.send("/?page=" + encodeURIComponent(numberOfPages));
      } else if (page < 1) {
        res.send("/?page=" + encodeURIComponent("1"));
      }

      // const startingLimit = (page - 1) * limit;

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const results = {};

      if (endIndex < rows.length) {
        results.next = {
          page: page + 1,
          limit: limit,
        };
      }

      if (startIndex > 0) {
        results.previous = {
          page: page - 1,
          limit: limit,
        };
      }

      // const user_id = req.params.id;

      let sql =
        "SELECT * FROM project WHERE user_id = ? AND pin_project = 0 ORDER BY date_created DESC";

      connectDB.query(sql, [req.params.id], function (err, rows) {
        if (err) {
          callback(error, null);
          return;
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

          const data = {
            page,
            iterator,
            endingLink,
            numberOfPages,
            results,
          };

          const rowsData = rows.slice(startIndex, endIndex);

          res.send({
            rows: rowsData,
            pagination: data,
          });

          // res.send(rows);
        }
      });

      // res.send(rows);
    }
  });
});

// const getProjectByUserId = asyncHandler(async (req, res) => {
//   const page = parseInt(req.query.page);
//   const limit = parseInt(req.query.limit);
//   // const resultsPerPage = 5;
//   let sql =
//     "SELECT * FROM project WHERE user_id = ? ORDER BY date_created DESC";
//   connectDB.query(sql, [req.params.id], function (err, rows) {
//     if (err) {
//       throw err;
//     } else {
//       const startIndex = (page - 1) * limit;
//       const endIndex = page * limit;

//       const results = {};

//       console.log("Projects: ", rows.length);

//       if (endIndex < rows.length) {
//         results.next = {
//           page: page + 1,
//           limit: limit,
//         };
//       }

//       if (startIndex > 0) {
//         results.previous = {
//           page: page - 1,
//           limit: limit,
//         };
//       }

//       let sql = `SELECT * FROM project WHERE user_id = ? ORDER BY date_created DESC LIMIT ${startIndex}, ${endIndex}`;

//       connectDB.query(sql, [req.params.id], function (err, rows) {
//         if (err) {
//           throw err;
//         } else {
//           res.send({
//             rows: rows,
//             pagination: results,
//           });
//         }
//       });

//       // res.send(rows);
//     }
//   });
// });

// @desc    Fecth projects with Project Name
// @route   POST /api/project/project_name

const getProjectByName = asyncHandler(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS,DELETE,PUT");
  res.setHeader("Access-Control-Allow-Headers", "*");

  const { user_id, project_name } = req.body;

  let page = req.query.page ? Number(req.query.page) : 1;
  const limit = parseInt(req.query.limit);

  // let sql = `SELECT * FROM project WHERE project_name LIKE '%${project_name}%'`;
  let sql = `SELECT * FROM project WHERE user_id = '${user_id}' AND project_name LIKE '%${project_name}%' ORDER BY date_created DESC`;

  connectDB.query(sql, function (err, rows) {
    if (err) {
      throw err;
    } else {
      if (!rows?.length) {
        res.json({ status: "failed", msg: "No record found" });
      } else {
        const numberOfResults = rows.length;
        const numberOfPages = Math.ceil(numberOfResults / limit);
        //
        if (page > numberOfPages) {
          res.send("/?page=" + encodeURIComponent(numberOfPages));
        } else if (page < 1) {
          res.send("/?page=" + encodeURIComponent("1"));
        }

        // const startingLimit = (page - 1) * limit;

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const results = {};

        if (endIndex < rows.length) {
          results.next = {
            page: page + 1,
            limit: limit,
          };
        }

        if (startIndex > 0) {
          results.previous = {
            page: page - 1,
            limit: limit,
          };
        }

        let sql = `SELECT * FROM project WHERE user_id = '${user_id}' AND project_name LIKE '%${project_name}%' ORDER BY date_created DESC LIMIT ${startIndex}, ${endIndex}`;

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

            const data = {
              page,
              iterator,
              endingLink,
              numberOfPages,
              results,
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

  const { start_date, end_date, user_id } = req.body;

  // let sql = "SELECT * FROM project WHERE DATE(date_created) = ?";
  // let sql = `SELECT * FROM project WHERE DATE(date_created) LIKE '%${project_date}%'`;
  // let sql = `SELECT * FROM project WHERE user_id = '${user_id}' AND DATE(date_created) LIKE '%${project_date}%' ORDER BY date_created DESC`;
  let sql = `SELECT * FROM project WHERE user_id = '${user_id}' AND DATE(date_created) BETWEEN '${start_date}' AND '${end_date}' ORDER BY date_created DESC`;
  // let sql = `SELECT * FROM project WHERE DATE(date_created) >= '${start_date}' AND date_created <= '${end_date}' `;

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

  let page = req.query.page ? Number(req.query.page) : 1;
  const limit = parseInt(req.query.limit);

  const { user_id } = req.body;

  let sql = `SELECT * FROM project WHERE user_id = '${user_id}' AND pin_project = 1 ORDER BY pin_project_date DESC`;

  connectDB.query(sql, function (err, rows) {
    if (err) {
      callback(error, null);
      return;
    } else {
      if (!rows?.length) {
        res.json({ status: "failed", msg: "No pinned projects" });
        return;
      } else {
        const numberOfResults = rows.length;
        const numberOfPages = Math.ceil(numberOfResults / limit);
        //
        if (page > numberOfPages) {
          res.send("/?page=" + encodeURIComponent(numberOfPages));
        } else if (page < 1) {
          res.send("/?page=" + encodeURIComponent("1"));
        }

        // const startingLimit = (page - 1) * limit;

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const results = {};

        if (endIndex < rows.length) {
          results.next = {
            page: page + 1,
            limit: limit,
          };
        }

        if (startIndex > 0) {
          results.previous = {
            page: page - 1,
            limit: limit,
          };
        }

        let sql = `SELECT * FROM project WHERE user_id = '${user_id}' AND pin_project = 1 ORDER BY pin_project_date DESC LIMIT ${startIndex}, ${endIndex}`;

        connectDB.query(sql, function (err, rows) {
          if (err) {
            callback(error, null);
            return;
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

            const data = {
              page,
              iterator,
              endingLink,
              numberOfPages,
              results,
            };
            res.send({
              rows: rows,
              pagination: data,
            });
          }
        });
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
          let sql = `UPDATE project SET pin_project = 0, pin_project_date = 0 WHERE project_id = '${project_id}'`;
          connectDB.query(sql, function (err, rows) {
            if (err) {
              throw err;
            } else {
              res.status(200).send("Unpinned Project Successfully");
            }
          });
        } else if (rows[0]?.pin_project == 0) {
          let sql = `UPDATE project SET pin_project = 1, pin_project_date = now() WHERE project_id = '${project_id}'`;
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

// @descd    Edit a project
// @route   GET /api/edit/project

const editProject = asyncHandler(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS,DELETE,PUT");
  res.setHeader("Access-Control-Allow-Headers", "*");
  // console.log("\nreq.file: ", req.file);
  console.log("Before Data: ");

  const {
    project_name,
    type_of_project,
    client_name,
    product_name,
    project_id,
  } = req.body;

  console.log("After Data: ");

  const company_logo = req.file.path;
  console.log("After company_logo: ");

  console.log("\ncompanyLogo: ", company_logo);

  if (company_logo) {
    var query = `UPDATE project SET project_name = '${project_name}', type_of_project = '${type_of_project}', client_name = '${client_name}', product_name = '${product_name}', company_logo = '${company_logo}' WHERE project_id = '${project_id}'`;
  } else {
    console.log("\n\nIMAGE ERROR");
  }

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

const editProjectWithoutImage = asyncHandler(async (req, res) => {
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

  console.log(
    "After Data: ",
    project_name,
    type_of_project,
    client_name,
    product_name,
    project_id
  );

  // const company_logo = req.file.path;
  // console.log("After company_logo: ");

  // console.log("\ncompanyLogo: ", company_logo);

  var query = `UPDATE project SET project_name = '${project_name}', type_of_project = '${type_of_project}', client_name = '${client_name}', product_name = '${product_name}' WHERE project_id = '${project_id}'`;

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
  getProjectsOrderByPin,
  editProjectWithoutImage,
};
