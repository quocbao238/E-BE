'use strict'

const express = require('express')
const DiscountController = require('../../controllers/discount.controller')
const router = express.Router()
const asyncHandler = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')

router.post('/amount', asyncHandler(DiscountController.getDiscountAmount))

router.get(
  '/list_product_code',
  asyncHandler(DiscountController.getAllDiscountCodesWithProduct)
)

router.use(authenticationV2)

router.post('', asyncHandler(DiscountController.createDiscount))
router.get('', asyncHandler(DiscountController.getAllDiscountCodes))

module.exports = router
