'use strict'

const { model, Schema } = require('mongoose') // Erase if already required

const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'Inventories'
// Declare the Schema of the Mongo model
var inventoryModel = new Schema(
  {
    inven_producId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    inven_location: {
      type: String,
      default: 'Unknown',
    },
    inven_stock: {
      type: Number,
      required: true,
    },
    inven_shopId: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
    inven_reservations: {
      type: Array,
      default: [],
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
)

//Export the model
module.exports = model(DOCUMENT_NAME, inventoryModel)
