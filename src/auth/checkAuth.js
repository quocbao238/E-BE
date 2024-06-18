"use strict";

const { findKeyById } = require("../services/apikey.service");
const { ReasonPhrases, StatusCodes } = require("../utils/httpStatusCode");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();

    if (!key) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: ReasonPhrases.FORBIDDEN,
      });
    }
    const objectKey = await findKeyById(key);

    if (!objectKey) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: ReasonPhrases.FORBIDDEN,
      });
    }

    req.objectKey = objectKey;
    return next();
  } catch (error) {
    return res.status(StatusCodes.FORBIDDEN).json({
      message: ReasonPhrases.FORBIDDEN,
    });
  }
};

const permission = (permission) => {
  return (req, res, next) => {
    const objectKey = req.objectKey;
    console.log("objectKey", objectKey);

    if (!req.objectKey.permissions) {
      return res.status(403).json({
        message: "Permission denied 1",
      });
    }
    console.log("permission", req.objectKey.permissions, permission);
    const validPermission = req.objectKey.permissions.includes(permission);
    if (!validPermission) {
      return res.status(403).json({
        message: "Permission denied 2",
      });
    }

    return next();
  };
};

module.exports = {
  apiKey,
  permission,
};
