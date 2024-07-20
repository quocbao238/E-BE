'use strict'

const { SuccessReponse } = require('../core/success.response')
const CheckoutService = require('../services/checkout.service')

class CheckoutController {
  checkoutReview = async (req, res, next) => {
    new SuccessReponse({
      message: 'Checkout review',
      metadata: await CheckoutService.checkoutReview(req.body),
    }).send(res)
  }
}

module.exports = new CheckoutController()
