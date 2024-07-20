'use strict'

const cartSchema = require('../models/cart.model')
const { BadRequestError, NotFoundError } = require('../core/error.response')
const CartRepository = require('../models/repositories/cart.repo')
const ProductReposiroty = require('../models/repositories/product.repo')
const DiscountService = require('./discount.service')

class CheckoutService {
  /*
        {
            cartId,
            userId,
            shop_order_ids: [
                {
                    shopId,
                    shop_discounts:[
                        {
                            shopId,
                            discountId,
                            codeId,
                        }
                    ],
                    item_products:[
                        {
                            productId,
                            quantity,
                            price,
                        }
                        
                    ]
                }
            ],
        }
    */

  static async checkoutReview({ cartId, userId, shop_order_ids }) {
    // check cartId is exist
    const foundCart = await CartRepository.findCartById(cartId)
    if (!foundCart) {
      throw new NotFoundError('Cart not found')
    }

    const checkout_order = {
        totalPrice: 0, // total price of all products
        feeShip: 0, // fee shipping
        totalDiscount: 0, // total discount of all products
        totalCheckout: 0, // total price of all products - total discount
      },
      shop_order_ids_new = []

    // calculate total price of all products
    for (const shop_order of shop_order_ids) {
      const { shopId, shop_discounts = [], item_products = [] } = shop_order
      // check product available in cart

      const checkProductInServer =
        await ProductReposiroty.checkProductAvailableInServer(item_products)

      if (!checkProductInServer[0])
        throw new BadRequestError('Product not found in server')

      console.log('checkProductInServer', checkProductInServer)

      // total price of all products
      const checkoutPrice = checkProductInServer.reduce((acc, product) => {
        return acc + product.price * product.quantity
      }, 0)

      checkout_order.totalPrice += checkoutPrice

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice, // price before discount
        priceApplyDiscount: checkoutPrice, // price after discount
        item_products: checkProductInServer,
      }

      // check discount is available & discount > 0
      if (shop_discounts.length > 0) {
        // if have only 1 discount

        const { totalPrice = 0, discount = 0 } =
          await DiscountService.getDiscountAmount({
            codeId: shop_discounts[0].codeId,
            userId,
            shopId,
            products: checkProductInServer,
          })

        // total discount
        checkout_order.totalDiscount += discount

        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount
        }
      }

      // total price of all products - total discount
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
      shop_order_ids_new.push(itemCheckout)
    }

    return { checkout_order, shop_order_ids, shop_order_ids_new }
  }
}

module.exports = CheckoutService
