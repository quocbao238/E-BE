"use strict";

const mongose = require("mongoose");
const { countConnect } = require("../helpers/check.connect");
const {
  db: { host, name, port },
} = require("../configs/config.mongodb");

const connectString = `mongodb://${host}:${port}/${name}`;

class Database {
  constructor() {
    this.connect();
  }

  connect(type = "mongodb") {
    if (1 === 1) {
      mongose.set("debug", true);
      mongose.set("debug", { color: true });
    }
    mongose
      .connect(connectString, {
        // Cải thiện hiệu suất khi thêm nhiều connection
        // Nếu connect 51 connection thì sẽ bị lỗi

        maxPoolSize: 50,
      })
      .then(() => {
        console.log(`Database connection successful ${connectString}`);
        countConnect();
      })
      .catch((err) => {
        console.error("Database connection failed");
      });
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongoDb = Database.getInstance();
module.exports = instanceMongoDb;
