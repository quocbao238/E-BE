"use strict";

const jwt = require("jsonwebtoken");

const createTokenPair = async (payload, publicKey, privateKey) => {
  // public key is verify token
  // private key is sign token
  try {
    const accessToken = await jwt.sign(payload, publicKey, {
      expiresIn: "2 days",
    });
    const refreshToken = await jwt.sign(payload, privateKey, {
      expiresIn: "7 days",
    });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log(`[P]::createTokenPair::error::`, error);
    return null;
  }
};

module.exports = {
  createTokenPair,
};
