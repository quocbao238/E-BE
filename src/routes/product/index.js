'use strict'

const express = require('express')
const ProductController = require('../../controllers/product.controller')
const router = express.Router()
const asyncHandler = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')

// authentication
router.use(authenticationV2)
router.post('', asyncHandler(ProductController.createProduct))
router.post(
  '/publish/:id',
  asyncHandler(ProductController.publishProductByShop)
)

//query
router.get(
  '/drafts/all',
  asyncHandler(ProductController.getAllDraftsProductForShop)
)
router.get(
  '/published/all',
  asyncHandler(ProductController.getAllPublishedProductForShop)
)

// authentication

module.exports = router
