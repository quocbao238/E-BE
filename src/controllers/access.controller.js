"use strict";

const AccessService = require("../services/access.service");

class AccessController {
  signUp = async (req, res, next) => {
    try {
      console.log(`[P]::signUp::`, req.body);
      // 200 OK
      // 201: CREATED
      const signUp = await AccessService.signUp(req.body);
      return res.status(201).json(signUp);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new AccessController();
