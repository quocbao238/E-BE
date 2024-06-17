"use strict";

const { findKeyById } = require("../services/apikey.service");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }
    const objectKey = await findKeyById(key);
    if (!objectKey) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    req.objectKey = objectKey;
    return next();
  } catch (error) {}
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

const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = {
  apiKey,
  permission,
  asyncHandler,
};
