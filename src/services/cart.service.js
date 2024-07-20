const cartSchema = require('../models/cart.model')
const { BadRequestError, NotFoundError } = require('../core/error.response')
const ProductReposiroty = require('../models/repositories/product.repo')
const { convertToObject } = require('typescript')
const { convertToObjectIdMongodb } = require('../utils')

/*
    Key Features:
    - Add product to cart
    - Reduce product quantity by one
    - Increase product quantity by one
    - Get Cart
    - Delete product from cart
    - Delete all products from cart

*/

class CartService {
  static async _createUserCart({ userId, product }) {
    const query = {
      cart_userId: userId,
      cart_state: 'active',
    }
    const updateOrInsert = {
        $addToSet: {
          cart_products: product,
        },
      },
      options = {
        upsert: true,
        new: true,
      }
    return await cartSchema.findOneAndUpdate(query, updateOrInsert, options)
  }

  static async _updateUserCartQuantity({ userId, product }) {
    const { productId, quantity } = product
    const query = {
        cart_userId: userId,
        cart_state: 'active',
        'cart_products.productId': productId,
      },
      updateSet = {
        $inc: {
          'cart_products.$.quantity': quantity,
        },
      },
      options = {
        new: true,
        upsert: true,
      }
    return await cartSchema.findOneAndUpdate(query, updateSet, options)
  }

  static async addProductToCart({ userId, product }) {
    // Find cart by userId
    console.log('userId', userId)
    const useCart = await cartSchema.findOne({
      cart_userId: userId,
    })
    if (!useCart) {
      // create new cart
      const cart = await this._createUserCart({ userId, product })
      return cart
    }
    // If cart exists -> check if product in cart is empty
    if (useCart.cart_products.length === 0) {
      useCart.cart_products.push(product)
      return await useCart.save()
    }

    // Cart exists and product is not empty -> update product
    return await this._updateUserCartQuantity({ userId, product })
  }

  // update cart
  /*
    shop_order_ids:[
        {
            shopId,
            version,
            item_products:[
                {
                    productId,
                    price,
                    shopId,
                    old_quantity,

                }
            ]
        } 
    ]
  */

  static async addToCartV2({ userId, shop_order_ids }) {
    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0]

    console.log('shop_order_ids', userId, shop_order_ids, productId, quantity)
    // check product
    const foundProduct = await ProductReposiroty.getProductById({
      product_id: convertToObjectIdMongodb(productId),
      unSelect: ['__v'],
    })
    if (!foundProduct) throw new NotFoundError('Product not found')
    // compare
    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId)
      throw new NotFoundError('Product not found in shop')
    // check quantity
    if (quantity === 0)
      throw new BadRequestError('Quantity must be greater than 0')

    console.log('foundProduct', foundProduct)
    return await this._updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    })
  }

  static async deleteUserCart({ userId, productId }) {
    const query = {
        cart_userId: userId,
        cart_state: 'active',
      },
      updateSet = {
        $pull: {
          cart_products: {
            productId,
          },
        },
      }
    const deleteCart = await cartSchema.updateOne(query, updateSet)
    return deleteCart
  }

  static async getListUserCart({ userId }) {
    console.log('userId', userId)
    return await cartSchema
      .findOne({
        cart_userId: userId,
      })
      .lean()
  }
}

module.exports = CartService
