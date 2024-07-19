const inventoryModel = require('../inventory.model')

class InventoryRepo {
  static async insert({ productId, shopId, stock, location = 'Unknown' }) {
    return await inventoryModel.create({
      inven_producId: productId,
      inven_location: location,
      inven_stock: stock,
      inven_shopId: shopId,
    })
  }
}

module.exports = InventoryRepo
