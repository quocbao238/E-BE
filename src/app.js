const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const app = express();

// init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// init db
require("./dbs/init.mongodb.lv0");

// init routes

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World" });
});

// handle errors

module.exports = app;
