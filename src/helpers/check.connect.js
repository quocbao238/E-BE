"use strict";

const { default: mongoose } = require("mongoose");
const os = require("os");
const process = require("process");

const _SECONDS = 5000;

const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log(`Number of connections: ${numConnection}`);
};

const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCore = os.cpus().length;
    const memory = process.memoryUsage().rss;
    // Maximum number of connections base on number of core
    const maxConnection = numCore * 5;

    console.log(`Active connections: ${numConnection}`);
    console.log(`Memory usage: ${memory / 1024 / 1024} MB`);

    if (numConnection > maxConnection) {
      console.log("Connection overload detected");
    }
  }, _SECONDS); // Monitor every 5 seconds
};

module.exports = { countConnect, checkOverload };
