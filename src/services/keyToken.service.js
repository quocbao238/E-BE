"use strict";

const keytokenModel = require("../models/keytoken.model");
const { Types } = require("mongoose");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      const filter = { user: userId },
        update = {
          publicKey,
          privateKey,
          refreshTokenUsed: [],
          refreshToken,
        },
        options = { upsert: true, new: true };

      // Nếu chưa có thì tạo mới, nếu có rồi thì update
      const tokens = await keytokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );
      console.log(`[P]::createKeyToken::`, userId, publicKey);
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      log.error(`[E]::createKeyToken::`, error);
      return error;
    }
  };

  static findByUserId = async (userId) => {
    const key = await keytokenModel.findOne({ user: userId })
    console.log(`[P]::findByUserId::`, userId, key);
    return key;
  };

  static removeKeyByUserId = async (userId) => {
    const delKey = await keytokenModel.deleteOne({ user: userId });
    console.log(`[P]::removeTokenByUserId::`, userId, delKey);
    return delKey;
  };

  static removeKeyById = async (id) => {
    const delKey = await keytokenModel.deleteOne({ _id: id });
    console.log(`[P]::removeTokenById::`, id, delKey);
    return delKey;
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keytokenModel
      .findOne({
        refreshTokenUsed: refreshToken,
      })
      .lean();
  };

  static findByRefreshToken = async (refreshToken) => {
    return await keytokenModel.findOne({
      refreshToken: refreshToken,
    });
  };
}

module.exports = KeyTokenService;
