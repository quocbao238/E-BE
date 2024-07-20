'use strict'
const { SuccessReponse, CREATED } = require('../core/success.response')
const InventoryService = require('../services/inventory.service')
class InventoryController {
  static async addStockToInventory(req, res, next) {
    new SuccessReponse({
      message: 'Stock added to inventory',
      metadata: await InventoryService.addStockToInventory(req.body),
    }).send(res)
  }
}
