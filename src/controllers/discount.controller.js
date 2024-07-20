'use strict'
const { SuccessReponse, CREATED } = require('../core/success.response')
const DiscountService = require('../services/discount.service')
class DiscountController {
  createDiscount = async (req, res, next) => {
    new SuccessReponse({
      message: 'Discount created successfully',
      metadata: await DiscountService.create({
        ...req.body,
        discount_shopId: req.user.userId,
      }),
    }).send(res)
  }

  getAllDiscountCodeByShop = async (req, res, next) => {
    new SuccessReponse({
      message: 'Successfully retrieved all discount codes',
      metadata: await DiscountService.getAllDiscountsByShop({
        ...req.query,
        discount_shopId: req.user.userId,
      }),
    }).send(res)
  }

  getDiscountAmount = async (req, res, next) => {
    new SuccessReponse({
      message: 'Successfully get discount amount',
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,
      }),
    }).send(res)
  }

  getAllDiscountCodesWithProduct = async (req, res, next) => {
    new SuccessReponse({
      message: 'Successfully getAllDiscountCodesWithProduct',
      metadata: await DiscountService.getDiscountsWithProduct({
        ...req.query,
      }),
    }).send(res)
  }
}

module.exports = new DiscountController()
