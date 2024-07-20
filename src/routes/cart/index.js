'use strict'

const express = require('express')
const CartController = require('../../controllers/cart.controller')
const router = express.Router()
const asyncHandler = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')

router.post('', asyncHandler(CartController.addTocart))
router.delete('', asyncHandler(CartController.deleteUserCart))
router.post('/update', asyncHandler(CartController.updateCart))
router.get('', asyncHandler(CartController.getListUserCart))

module.exports = router
