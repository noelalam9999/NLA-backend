const express = require("express");
const router = express.Router();

// ----------------------------------

router.get("/", (req, res, next) => {
  res.status(200).send("Login Page");
});
// router.route("/").get();

module.exports = router;
