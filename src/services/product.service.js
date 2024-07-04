'use strict'

const {
  product,
  clothing,
  electronic,
  furniture,
  DOCUMENT_NAME_CLOTHING,
  DOCUMENT_NAME_ELECTRONIC,
  DOCUMENT_NAME_FURNITURE,
} = require('../models/product.model')
const ProductReposiroty = require('../models/repositories/product.repo')
const { BadRequestError, ForbiddenError } = require('../core/error.response')

class ProductFactory {
  static productRegistry = {}

  static registerProductType({ type, classRef }) {
    ProductFactory.productRegistry[type] = classRef
  }
  static async createProduct({ type, payload }) {
    const ProductClass = ProductFactory.productRegistry[type]
    if (!ProductClass) throw new BadRequestError(`Invalid product type ${type}`)
    return new ProductClass(payload).createProduct()
  }

  //********************** PUT **********************//

  static async publishProductByShop({ product_shop, product_id }) {
    return await ProductReposiroty.publishProductByShop({
      product_shop,
      product_id,
    })
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    return await ProductReposiroty.unPublishProductByShop({
      product_shop,
      product_id,
    })
  }

  //********************** QUERY **********************//
  // find all draft products
  static async getAllDraftsProductForShop({
    product_shop,
    limit = 50,
    skip = 0,
  }) {
    const query = { product_shop, isDraft: true }
    return await ProductReposiroty.getAllDraftsProductForShop({
      query,
      limit,
      skip,
    })
  }

  // find all published products
  static async getAllPublishedProductForShop({
    product_shop,
    limit = 50,
    skip = 0,
  }) {
    const query = { product_shop, isPublished: true }
    return await ProductReposiroty.getAllPublishProductForShop({
      query,
      limit,
      skip,
    })
  }

  static async getListSearchProduct({ keySearch }) {
    return await ProductReposiroty.searchProductByUser({ keySearch })
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

class Furniture extends Product {
  async createProduct() {
    const newFurnite = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    })
    if (!newFurnite) {
      throw new BadRequestError('Creating furniture failed')
    }

    const newProduct = await super.createProduct({
      product_id: newFurnite._id,
    })
    if (!newProduct) {
      throw new BadRequestError('Creating product failed')
    }
    return newProduct
  }
}

// register product types
ProductFactory.registerProductType({
  type: DOCUMENT_NAME_CLOTHING,
  classRef: Clothing,
})
ProductFactory.registerProductType({
  type: DOCUMENT_NAME_ELECTRONIC,
  classRef: Electronic,
})
ProductFactory.registerProductType({
  type: DOCUMENT_NAME_FURNITURE,
  classRef: Furniture,
})

module.exports = ProductFactory
