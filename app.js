import express from "express";
// const app = express();
import cors from "cors";

import morgan from "morgan";
import connectDB from "./config/db.js";
// const { makeDb } = require("mysql-async-simple");

import loginRoutes from "./routes/loginRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";

// ----------------------------------
connectDB;
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*",
    // credentials: true,
  })
);

// app.use(cors());
// app.options("*", cors());

app.use(morgan("dev"));

// Routes ----------------------------------------------------
app.use("/api", loginRoutes);
app.use("/api", projectRoutes);
// app.get("/api", (req, res, next) => {
//   res.status(200).send("API");
// });

// ---------------------------------------------------------
app.use((req, res, next) => {
  const error = new Error("Page Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 5000);
  res.json({
    error: {
      message: error.message,
    },
  });
});

export default app;
