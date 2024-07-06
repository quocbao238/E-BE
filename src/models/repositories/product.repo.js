'use strict'

const {
  product,
  electronic,
  furniture,
  clothing,
} = require('../../models/product.model')
const { getSelectData, unGetSelectData } = require('../../utils')
const { Types } = require('mongoose')

class ProductReposiroty {
  static async getAllProducts({ query, limit, skip }) {
    return await product
      .find(query)
      .populate('product_shop', 'name email -_id')
      .sort({ updateAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec()
  }

  static async getAllDraftsProductForShop({ query, limit, skip }) {
    return await ProductReposiroty.getAllProducts({ query, limit, skip })
  }

  static async getAllPublishProductForShop({ query, limit, skip }) {
    return await ProductReposiroty.getAllProducts({ query, limit, skip })
  }

  static async searchProductByUser({ keySearch }) {
    const regexSearch = new RegExp(keySearch)
    const results = await product
      .find(
        {
          isPublished: true,
          $text: { $search: regexSearch },
        },
        {
          score: { $meta: 'textScore' },
        }
      )
      .sort({ score: { $meta: 'textScore' } })
      .lean()
    return results
  }

  static async getProducts({ limit, sort, page, filter, select }) {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const products = await product
      .find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select(getSelectData(select))
      .lean()
      .exec()

    return products
  }

  static async getProductById({ product_id, unSelect }) {
    return await product.findById(product_id).select(unGetSelectData(unSelect))
  }

  // post
  static async publishProductByShop({ product_shop, product_id }) {
    const foundShop = await product.findOne({
      product_shop: Types.ObjectId(product_shop),
      _id: Types.ObjectId(product_id),
    })
    if (!foundShop) throw new Error('Product not found')
    foundShop.isDraft = false
    foundShop.isPublished = true
    const { modifiedCount } = foundShop.save()
    return modifiedCount
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    const foundShop = await product.findOne({
      product_shop: Types.ObjectId(product_shop),
      _id: Types.ObjectId(product_id),
    })
    if (!foundShop) throw new Error('Product not found')
    foundShop.isDraft = true
    foundShop.isPublished = false
    const { modifiedCount } = foundShop.save()
    return modifiedCount
  }
}

module.exports = ProductReposiroty
