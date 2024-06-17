"use strict";

const { apiKey } = require("../auth/checkAuth");
const apikeyModel = require("../models/apikey.model");
const crypto = require("crypto");

const findKeyById = async (key) => {
  const objectKey = await apikeyModel.findOne({ key, status: true }).lean();
  console.log("findKeyById", objectKey);
  return objectKey;
};

module.exports = {
  findKeyById,
};
