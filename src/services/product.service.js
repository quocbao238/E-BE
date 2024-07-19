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
const { BadRequestError } = require('../core/error.response')
const { removeUndefinedNull, updateNestedObjectParser } = require('../utils')
const InventoryRepo = require('../models/repositories/inventory.repo')

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

  static async updateProduct(type, productId, payload) {
    const ProductClass = ProductFactory.productRegistry[type]
    if (!ProductClass) throw new BadRequestError(`Invalid product type ${type}`)
    return new ProductClass(payload).updateProduct(productId)
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

  static async getProducts({
    limit = 50,
    sort = 'ctime',
    page = 1,
    filter = { isPublished: true },
  }) {
    // ctime is sort by newest created time
    return await ProductReposiroty.getProducts({
      limit,
      sort,
      page,
      filter,
      select: [
        'product_name',
        'product_thumb',
        'product_price',
        'product_type',
      ],
    })
  }

  static getProduct = async ({ product_id }) => {
    return await ProductReposiroty.getProductById({
      product_id,
      unSelect: ['__v'],
    })
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
    const newProduct = await product.create({
      ...this,
      _id: product_id,
    })
    console.log(`[1]::`, product)
    if (newProduct) {
      // add product_stock to inventory collection
      await InventoryRepo.insert({
        productId: newProduct._id,
        shopId: this.product_shop,
        stock: this.product_quantity,
      })
    }
    return newProduct
  }
  async updateProduct(productId, bodyUpdate) {
    return await ProductReposiroty.updateProductById({
      productId,
      bodyUpdate,
      model: product,
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

  async updateProduct(productId) {
    console.log(`[1]::`, this)
    const objectParams = removeUndefinedNull(this)
    console.log(`[2]::`, objectParams)
    if (objectParams.product_attributes) {
      // update child
      await ProductReposiroty.updateProductById({
        productId,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
        model: clothing,
      })
    }

    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objectParams)
    )
    return updateProduct
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
