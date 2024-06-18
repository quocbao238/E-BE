"use strict";

const jwt = require("jsonwebtoken");
const asyncHandler = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");

// service
const KeyTokenService = require("../services/keyToken.service");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  // public key is verify token
  // private key is sign token
  const accessToken = jwt.sign(payload, publicKey, {
    expiresIn: "2 days",
  });
  const refreshToken = jwt.sign(payload, privateKey, {
    expiresIn: "7 days",
  });
  return { accessToken, refreshToken };
};

const authentication = asyncHandler(async (req, res, next) => {
  // Check userId missing
  // Get accessToken from header
  // Verify accessToken
  // Check user in database
  // Check keystore with this userId
  // Return next() if all is ok
  const headers = req.headers;

  console.log("step0", headers);
  const userId = headers[HEADER.CLIENT_ID]?.toString();
  if (!userId) throw new AuthFailureError("Invalid request");

  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore)
    throw new NotFoundError("Invalid request - KeyStore not found");
  console.log("step1", keyStore);

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid request");

  try {
    const decodeUser = jwt.verify(accessToken, keyStore.publicKey);

    console.log("step3", decodeUser);
    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Invalid UserId");

    req.keyStore = keyStore;

    return next();
  } catch (error) {
    console.log("error", error);
    throw error;
  }
});

const verifyJWT = (token, keySecret) => {
  return jwt.verify(token, keySecret);
};

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT,
};
