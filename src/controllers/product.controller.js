'use strict'

const ProductService = require('../services/product.service')

const { SuccessReponse } = require('../core/success.response')

class ProductController {
  // ********************** POST **********************//

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

  publishProductByShop = async (req, res, next) => {
    const { id } = req.params
    return new SuccessReponse({
      message: 'Published product successfully',
      metadata: await ProductService.publishProductByShop({
        product_shop: req.user.userId,
        product_id: id,
      }),
    }).send(res)
  }

  unPublishProductByShop = async (req, res, next) => {
    const { id } = req.params
    return new SuccessReponse({
      message: 'Unpublished product successfully',
      metadata: await ProductService.unPublishProductByShop({
        product_shop: req.user.userId,
        product_id: id,
      }),
    }).send(res)
  }

  // ********************** QUERY **********************//
  /**
   *
   * @desc Get all draft products for a shop
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON}
   */
  getAllDraftsProductForShop = async (req, res, next) => {
    new SuccessReponse({
      message: 'Get draft products for shop successfully',
      metadata: await ProductService.getAllDraftsProductForShop({
        product_shop: req.user.userId,
      }),
    }).send(res)
  }

  /**
   *
   * @desc Get all published products for a shop
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON}
   */
  getAllPublishedProductForShop = async (req, res, next) => {
    new SuccessReponse({
      message: 'Get published products for shop successfully',
      metadata: await ProductService.getAllPublishedProductForShop({
        product_shop: req.user.userId,
      }),
    }).send(res)
  }

  getListSearchProduct = async (req, res, next) => {
    new SuccessReponse({
      message: 'Get list search product successfully',
      metadata: await ProductService.getListSearchProduct(req.params),
    }).send(res)
  }
}

module.exports = new ProductController()
