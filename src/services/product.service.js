'use strict'

const { product, clothing, electronic } = require('../models/product.model')
const { BadRequestError, ForbiddenError } = require('../core/error.response')

class ProductFactory {
  static async createProduct({ type, payload }) {
    console.log('creating product', type, payload)
    switch (type) {
      case 'Electronic':
        return new Electronic(payload).createProduct()
      case 'Clothing':
        return new Clothing(payload).createProduct()
      default:
        throw new BadRequestError(`Invalid product type ${type}`)
    }
  }
}

// define base product class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name
    this.product_thumb = product_thumb
    this.product_description = product_description
    this.product_price = product_price
    this.product_quantity = product_quantity
    this.product_type = product_type
    this.product_shop = product_shop
    this.product_attributes = product_attributes
  }

  async createProduct({ product_id }) {
    // use id of the sub class to set id of the product
    return await product.create({
      ...this,
      _id: product_id,
    })
  }
}

// Define sub classes for each product type
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    })
    if (!newClothing) {
      throw new BadRequestError('Creating clothing failed')
    }

    const newProduct = await super.createProduct({
      product_id: newClothing._id,
    })
    if (!newProduct) {
      throw new BadRequestError('Creating product failed')
    }
    return newProduct
  }
}

class Electronic extends Product {
  async createProduct() {
    console.log('creating electronic', this)
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    })
    if (!newElectronic) {
      throw new BadRequestError('Creating electronic failed')
    }

    const newProduct = await super.createProduct({
      product_id: newElectronic._id,
    })
    if (!newProduct) {
      throw new BadRequestError('Creating product failed')
    }
    return newProduct
  }
}

module.exports = ProductFactory
