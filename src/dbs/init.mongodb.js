"use strict";
const mongose = require("mongoose");

const connectString = "mongodb://localhost:27017/learnNode";

class Database {
  constructor() {
    this._connect();
  }
  _connect(type = "mongodb") {
    mongose
      .connect(connectString)
      .then(() => {
        console.log("Database connection successful");
      })
      .catch((err) => {
        console.error("Database connection failed");
      });
  }
}
