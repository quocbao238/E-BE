'use strict'

const { SuccessReponse } = require('../core/success.response')
const CartService = require('../services/cart.service')

class CartController {
  /*
  @params: userId, product

  */
  addTocart = async (req, res, next) => {
    new SuccessReponse({
      message: 'Product added to cart successfully',
      metadata: await CartService.addProductToCart(req.body),
    }).send(res)
  }

  updateCart = async (req, res, next) => {
    new SuccessReponse({
      message: 'Cart updated successfully',
      metadata: await CartService.addToCartV2(req.body),
    }).send(res)
  }

  deleteUserCart = async (req, res, next) => {
    new SuccessReponse({
      message: 'Cart removed successfully',
      metadata: await CartService.deleteUserCart(req.body),
    }).send(res)
  }

  getListUserCart = async (req, res, next) => {
    new SuccessReponse({
      message: 'List of cart',
      metadata: await CartService.getListUserCart(req.query),
    }).send(res)
  }
}

module.exports = new CartController()
