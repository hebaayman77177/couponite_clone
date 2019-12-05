const express = require("express");

const passport = require("passport");
const errorHandler = require("../middlewares/error-middleware");
const userRouter = require("../routes/user-router");
const systemUserRouter = require("../routes/systemUser-router");

//const notfound = require('../middleware/notfound-middleware');

module.exports = function(app) {
  //app.use('/', hanlder);
  app.use(passport.initialize());
  app.use(express.json());
  app.get("/", (req, res, next) => {
    res.send("<h1> Hello World!</h1>");
  });

  app.use("/api/user", userRouter);
  app.use("/api/systemUsers", systemUserRouter);
  //app.use(notfound);
  app.use(errorHandler);
};
