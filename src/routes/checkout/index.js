'use strict'

const express = require('express')
const CheckoutController = require('../../controllers/checkout.controller')
const router = express.Router()
const asyncHandler = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')

router.use(authenticationV2)

router.post('/review', asyncHandler(CheckoutController.checkoutReview))

module.exports = router
