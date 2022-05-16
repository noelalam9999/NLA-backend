const express = require("express");
const app = express();
const morgan = require("morgan");
const connectDB = require("./config/db");

const loginRoutes = require("./routes/loginRoutes");

// import loginRoutes from "./routes/loginRoutes";

// ----------------------------------
// connectDB;

app.use(morgan("dev"));

// Routes
app.use("/login", loginRoutes);
app.get("/api", (req, res, next) => {
  res.status(200).send("API");
});

app.use((req, res, next) => {
  const error = new Error("Not Found");
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

module.exports = app;
