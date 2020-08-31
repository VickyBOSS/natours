const express = require("express");
const app = express();
const morgan = require("morgan");
const userRouter = require("./routes/userRoutes");
const tourRouter = require("./routes/tourRoutes");

const staticFilesPath = __dirname + "/public";

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(express.static(staticFilesPath));
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tours", tourRouter);

module.exports = app;
