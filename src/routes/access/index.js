"use strict";

const express = require("express");
const AccessController = require("../../controllers/access.controller");
const router = express.Router();
const asyncHandler = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");

// SignUp
router.post("/shop/signup", asyncHandler(AccessController.signUp));
router.post("/shop/login", asyncHandler(AccessController.login));

// authentication
router.use(authenticationV2);

router.post("/shop/logout", asyncHandler(AccessController.logout));
router.post(
  "/shop/refresh-token",
  asyncHandler(AccessController.handleRefreshToken)
);

// authentication

module.exports = router;
