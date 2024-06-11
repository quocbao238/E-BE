require("dotenv").config();
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
const { checkOverload } = require("./helpers/check.connect");
require("./dbs/init.mongodb");
// checkOverload();

// init routes
app.use("/", require("./routes"));

// handle errors1

module.exports = app;
