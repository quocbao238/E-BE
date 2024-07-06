'use strict'

const express = require('express')
const ProductController = require('../../controllers/product.controller')
const router = express.Router()
const asyncHandler = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')

router.get(
  '/search/:keySearch',
  asyncHandler(ProductController.getListSearchProduct)
)
router.get('/all', asyncHandler(ProductController.getProducts))
router.get('/:product_id', asyncHandler(ProductController.getProductById))

// authentication
router.use(authenticationV2)

router.post('', asyncHandler(ProductController.createProduct))
router.post(
  '/publish/:id',
  asyncHandler(ProductController.publishProductByShop)
)

router.post(
  '/unpublish/:id',
  asyncHandler(ProductController.unPublishProductByShop)
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
