'use strict'

const ProductService = require('../services/product.service')

const { SuccessReponse } = require('../core/success.response')

class ProductController {
  createProduct = async (req, res, next) => {
    const { product_type } = req.body
    return new SuccessReponse({
      message: 'Created product successfully',
      metadata: await ProductService.createProduct({
        type: product_type,
        payload: {
          ...req.body,
          product_shop: req.user.userId,
        },
      }),
    }).send(res)
  }
}

module.exports = new ProductController()
