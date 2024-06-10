"use strict";

const mongose = require("mongoose");

const connectString = "mongodb://localhost:27017/learnNode";
mongose
  .connect(connectString)
  .then(() => {
    console.log("Connected to MongoDB Successfully");
  })
  .catch((err) => console.log(`Error connecting to MongoDB: ${err.message}`));

// dev
if (1 === 0) {
  mongose.set("debug", true);
  mongose.set("debug", { color: true });
}

module.exports = mongose;
