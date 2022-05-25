import express from "express";
const router = express.Router();

import projectModel from "../models/projectModel.js";

import {
  getProjects,
  getProjectByUserId,
  addProject,
} from "../controllers/projectController.js";

// ----------------------------------

router.post("/add/project", addProject);

router.route("/projects").get(getProjects);
router.route("/project/:id").get(getProjectByUserId);

// router.get("/add/projects", (req, res, next) => {
//   projectModel();
//   res.status(200).send("New rows inserted into Database..");
// });

export default router;
