import express from "express";
const app = express();
import morgan from "morgan";
import connectDB from "./config/db.js";
// const { makeDb } = require("mysql-async-simple");

import loginRoutes from "./routes/loginRoutes.js";

// import loginRoutes from "./routes/loginRoutes";

// ----------------------------------
connectDB;

app.use(express.json());

// global.con = require("./connection");
// global.db = makeDb();

app.use(morgan("dev"));

// Routes
app.use("/api", loginRoutes);
// app.get("/api", (req, res, next) => {
//   res.status(200).send("API");
// });

// --------------------------------------
app.use((req, res, next) => {
  const error = new Error("Page Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 3000);
  res.json({
    error: {
      message: error.message,
    },
  });
});

// module.exports = app;

export default app;
