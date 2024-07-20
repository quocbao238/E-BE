const { it, is } = require('date-fns/locale')
const { BadRequestError } = require('../core/error.response')
const discountModel = require('../models/discount.model')
const { convertToObjectIdMongodb } = require('../utils')
const ProductRepository = require('../models/repositories/product.repo')
const DiscountReposiroty = require('../models/repositories/discount.repo')

/* Discount Service
1. Generate discount code [Shop, Admin]
    - Shop can generate discount code for their shop
    - Admin can generate discount code for all shops
2. Get discount amount [User]
    - User can get discount amount by providing discount code
3. Get all discount codes [User,Shop]
    - User can get all discount codes for applying discount
    - Shop can get all discount codes for managing their shop
4. Verify discount code [User]
5. Remove discount code [Shop, Admin]
    - Shop can remove discount code for their shop
    - Admin can remove discount code for all shops
6. Cancel discount code [User]
*/

class DisscountService {
  static async create(payload) {
    const {
      discount_name,
      discount_description,
      discount_type,
      discount_value,
      discount_code,
      discount_start_date,
      discount_end_date,
      discount_max_uses,
      discount_users_used,
      discount_max_uses_per_user,
      discount_is_active,
      discount_min_order_value,
      discount_max_value,
      discount_uses_count,
      discount_product_ids,
      discount_shopId,
      discount_apply_to,
    } = payload

    // Validate discount_start_date and discount_end_date
    // if (
    //   new Date() < new Date(discount_start_date) ||
    //   new Date() > new Date(discount_end_date)
    // ) {
    //   throw new BadRequestError('Discount code has expired')
    // }
    if (new Date(discount_start_date) > new Date(discount_end_date)) {
      throw new BadRequestError('Discount start & end is invalid')
    }

    // Cheeck if discount_code is unique
    const item = await discountModel.findOne({
      discount_code,
      discount_shopId: convertToObjectIdMongodb(discount_shopId),
    })
    if (item && item.discount_is_active)
      throw new BadRequestError('Discount code is already exist')

    // New discount
    const newDiscount = await discountModel.create({
      discount_name,
      discount_description,
      discount_type,
      discount_value,
      discount_code,
      discount_min_order_value: discount_min_order_value || 0,
      discount_max_value: discount_max_value,
      discount_start_date: new Date(discount_start_date),
      discount_end_date: new Date(discount_end_date),
      discount_max_uses,
      discount_uses_count,
      discount_users_used,
      discount_max_uses_per_user,
      discount_shopId: discount_shopId,
      discount_is_active,
      discount_apply_to,
      discount_product_ids:
        discount_apply_to == 'all' ? [] : discount_product_ids,
    })

    return newDiscount
  }

  // get all product inside discount [User]
  static async getDiscountsWithProduct({ code, shopId, userId, limit, page }) {
    // check unique discount code
    const found = await discountModel
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectIdMongodb(shopId),
      })
      .lean()

    if (!found || !found.discount_is_active)
      throw new BadRequestError('Discount not exist')

    const { discount_apply_to, discount_product_ids } = found
    let product
    if (discount_apply_to === 'all') {
      //   return found
      // get all product
      product = await ProductRepository.getProducts({
        limit: +limit,
        page: +page,
        filter: {
          product_shop: convertToObjectIdMongodb(shopId),
          isPublished: true,
        },
        sort: 'ctime',
        select: ['product_name'],
      })
    }
    if (discount_apply_to === 'specific') {
      product = await ProductRepository.getProducts({
        limit: +limit,
        page: +page,
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        sort: 'ctime',
        select: ['product_name'],
      })

      console.log('product', product)
    }
    return product
  }

  static async getAllDiscountsByShop({ limit, page, shopId }) {
    const discounts = await DiscountReposiroty.findAllDiscountCodesSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToObjectIdMongodb(shopId),
        discount_is_active: true,
      },
      select: ['discount_name', 'discount_shopId'],
      model: discountModel,
    })
    return discounts
  }

  // Applies discount to the order
  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    console.log('getDiscountAmount', codeId, userId, shopId, products)
    const foundDiscount = await DiscountReposiroty.checkDiscountExist({
      model: discountModel,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongodb(shopId),
      },
    })

    if (!foundDiscount) throw new BadRequestError('Discount not found')

    const {
      discount_is_active,
      discount_max_uses,
      discount_min_order_value,
      discount_max_uses_per_user,
      discount_type,
      discount_value,
    } = foundDiscount

    // validate discount code
    if (!discount_is_active) throw new BadRequestError('Discount has expired')

    if (discount_max_uses <= 0)
      throw new BadRequestError('Discount are out of uses')
    if (
      new Date() < new Date(foundDiscount.discount_start_date) ||
      new Date() > new Date(foundDiscount.discount_end_date)
    )
      throw new BadRequestError('Discount code has expired')

    let totalOrderValue

    if (discount_min_order_value > 0) {
      totalOrderValue = products.reduce((acc, product) => {
        return acc + product.price * product.quantity
      }, 0)

      if (totalOrderValue < discount_min_order_value)
        throw new BadRequestError('Order value is not enough')
    }

    if (discount_max_uses_per_user > 0) {
      const userUsed = foundDiscount.discount_users_used.find(
        (item) => item.userId === userId
      )
      if (userUsed && userUsed.uses >= discount_max_uses_per_user)
        throw new BadRequestError('Discount code has reached maximum uses')
    }

    // check discount is fixed or percentage
    const amount =
      discount_type === 'fixed_amount'
        ? discount_value
        : (totalOrderValue * discount_value) / 100

    return {
      totalOrderValue,
      discount: amount,
      totalPrice: totalOrderValue - amount,
    }
  }

  static async deleteDiscountCode({ shopId, codeId }) {
    const deleted = await discountModel.findOneAndDelete({
      discount_code: codeId,
      discount_shopId: convertToObjectIdMongodb(shopId),
    })
    return deleted
  }

  static async cancelDiscountCode({ codeId, shopId, userId }) {
    const found = await DiscountReposiroty.checkDiscountExist({
      model: discountModel,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongodb(shopId),
      },
    })
    if (!found) throw new BadRequestError('Discount not found')

    const result = await discountModel.findByIdAndUpdate(found._id, {
      $pull: { discount_users_used: userId },
      $inc: { discount_max_uses: 1, discount_uses_count: -1 },
    })
    return result
  }
}

module.exports = DisscountService
