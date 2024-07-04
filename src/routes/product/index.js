'use strict'

const express = require('express')
const ProductController = require('../../controllers/product.controller')
const router = express.Router()
const asyncHandler = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')

// authentication
router.use(authenticationV2)

console.log('product router')

router.post('', asyncHandler(ProductController.createProduct))

// authentication

module.exports = router
