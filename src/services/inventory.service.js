const inventoryModel = require('../models/inventory.model')
const { BadRequestError, NotFoundError } = require('../core/error.response')
const ProductReposiroty = require('../models/repositories/product.repo')
const { convertToObjectIdMongodb } = require('../utils')

class InventoryService {
  static async addStockToInventory({
    stock,
    productId,
    shopId,
    location = '322 High Street, Preston, VIC 3072',
  }) {
    const product = await ProductReposiroty.getProductById({
      product_id: productId,
      unSelect: ['__v'],
    })
    if (!product) {
      throw new BadRequestError('Product not found')
    }

    const query = {
        inven_shopId: convertToObjectIdMongodb(shopId),
        inven_producId: convertToObjectIdMongodb(productId),
      },
      updateSet = {
        $inc: { inven_stock: stock },
        $set: { inven_location: location },
      },
      options = { upsert: true, new: true }

    return await inventoryModel.findOneAndUpdate(query, updateSet, options)
  }
}

module.exports = InventoryService
