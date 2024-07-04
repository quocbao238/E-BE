const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError } = require("../core/error.response");
const { findByEmail } = require("./shop.service");

const {
  AuthFailureError,
  ForbiddenError,
  NotFoundError,
} = require("../core/error.response");

const RoleShop = {
  SHOP: "shop",
  WRITER: "writer",
  EDITOR: "editor",
  ADMIN: "admin",
};

class AccessService {
  // oginKeyTokenService
  // Check email in dbs
  // Match password
  // Generate token pair [privateKey, publicKey]
  // Genegrate tokens [accessToken, refreshToken]
  // Get data user
  static login = async ({ email, password }) => {
    // Check email in dbs

    const foundShop = await findByEmail(email);

    if (!foundShop) {
      throw new BadRequestError("Shop not registered");
    }
    // Match password

    const match = bcrypt.compare(password, foundShop.password);
    if (!match) {
      throw new AuthFailureError("Authentication error");
    }
    // Generate token pair [privateKey, publicKey]
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    // Genegrate tokens [accessToken, refreshToken]
    const tokens = await createTokenPair(
      { userId: foundShop._id, email },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      userId: foundShop._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    return {
      shop: getInfoData({
        fileds: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError("Shop already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });

    if (newShop) {
      // Easily generate a random key pair
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

      // Insert the key pair into the database
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        throw new BadRequestError("keyStore error");
      }

      // create token pair {accessToken, refreshToken} for user
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );

      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fileds: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }

    return {
      code: 200,
      metadata: null,
    };
  };

  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    return delKey;
  };

  // Call when accessToken is expired
  static handleRefreshToken = async (refreshToken) => {
    // check tokens is used
    const tokenUsed = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    );

    // if token is used, check who used it

    if (tokenUsed) {
      // refeshtoken create by payload & privaryKey
      const { userId, email } = verifyJWT(refreshToken, tokenUsed.privateKey);
      // remove key
      await KeyTokenService.removeKeyByUserId(userId);
      throw new ForbiddenError("Something went wrong. Please login again");
    }

    // If token is not used, check who hold it
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);

    if (!holderToken) throw new AuthFailureError("Refresh token not found");

    // verify refreshToken
    const { userId, email } = verifyJWT(refreshToken, holderToken.privateKey);


    // generate new token pair
    const foundShop = await findByEmail(email);
    if (!foundShop) throw new AuthFailureError("Shop not registered");

    // create token pair {accessToken, refreshToken} for user
    const tokens = await createTokenPair(
      { userId: foundShop._id, email },
      holderToken.publicKey,
      holderToken.privateKey
    );

    // update token to db
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokenUsed: refreshToken, // add refreshToken use in this time
      },
    });

    return {
      user: { userId, email },
      tokens,
    };
  };

  // handle refresh v2
  static handleRefreshTokenV2 = async ({ refreshToken, user, keyStore }) => {
    // check tokens is used
    if (keyStore.refreshTokenUsed.includes(refreshToken)) {
      await KeyTokenService.removeKeyByUserId(userId);
      throw new ForbiddenError("Something went wrong. Please login again");
    }

    if (keyStore.refreshToken !== refreshToken) {
      throw new ForbiddenError("Refresh token not found");
    }

    const foundShop = await findByEmail(email);
    if (!foundShop) throw new AuthFailureError("Shop not registered");

    // create token pair {accessToken, refreshToken} for user
    const tokens = await createTokenPair(
      { userId: foundShop._id, email },
      holderToken.publicKey,
      holderToken.privateKey
    );

    // update token to db
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokenUsed: refreshToken, // add refreshToken use in this time
      },
    });

    return {
      user,
      tokens,
    };
  };
}

module.exports = AccessService;
