import express from "express";
const router = express.Router();
import multer from "multer";

import projectModel from "../models/projectModel.js";

import {
  getProjects,
  addPinnedProject,
  addUnPinnedProject,
  getProjectByUserId,
  getProjectByName,
  addProject,
  getProjectByDate,
  getProjectByDateAndName,
  getPinnedProjects,
  getUnPinnedProjects,
} from "../controllers/projectController.js";

// -----------------------------------------------------------

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// -----------------------------------------------------------

//Add Project
router.post("/add/project", upload.single("company_logo"), addProject);
router.post("/add/project/pinned", addPinnedProject);
router.post("/add/project/unpinned", addUnPinnedProject);

//Get Projects
router.route("/projects").get(getProjects);
router.route("/projects/:id").get(getProjectByUserId);
router.route("/project/pinned").get(getPinnedProjects);
router.route("/project/unpinned").get(getUnPinnedProjects);

//Project Filtering
router.post("/project/name", getProjectByName);
router.post("/project/date", getProjectByDate);
router.post("/project/search", getProjectByDateAndName);

// router.post("/project/pinned", getPinnedProjects);

// router.get("/add/projects", (req, res, next) => {
//   projectModel();
//   res.status(200).send("New rows inserted into Database..");
// });

export default router;
