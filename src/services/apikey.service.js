"use strict";

const { apiKey } = require("../auth/checkAuth");
const apikeyModel = require("../models/apikey.model");
const crypto = require("crypto");

const findKeyById = async (key) => {
  // const newKey = await apikeyModel.create({
  //   key: crypto.randomBytes(64).toString("hex"),
  //   permissions: ["0000"],
  // });

  const objectKey = await apikeyModel.findOne({ key, status: true }).lean();
  return objectKey;
};

module.exports = {
  findKeyById,
};
