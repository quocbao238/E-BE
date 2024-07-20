const inventoryModel = require('../inventory.model')
const { convertToObjectIdMongodb } = require('../../utils')

class InventoryRepo {
  static async insert({ productId, shopId, stock, location = 'Unknown' }) {
    return await inventoryModel.create({
      inven_producId: productId,
      inven_location: location,
      inven_stock: stock,
      inven_shopId: shopId,
    })
  }

  static async reservationInventory({ productId, cardId, quantity }) {
    const query = {
        inven_producId: convertToObjectIdMongodb(productId),
        inven_stock: { $gte: quantity },
      },
      updateSet = {
        $inc: { inven_stock: -quantity },
        $push: {
          inven_reservations: {
            cardId,
            quantity,
            createdOn: new Date(),
          },
        },
      },
      options = { new: true, upsert: true }

    return await inventoryModel.updateOne(query, updateSet)
  }
}

module.exports = InventoryRepo
