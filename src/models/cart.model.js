'use strict'

const { model, Schema } = require('mongoose')

const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'Carts'

const cartSchema = new Schema(
  {
    cart_state: {
      type: String,
      enum: ['active', 'failed', 'completed', 'pending'],
      default: 'active',
    },
    /*
    {
      product_id: 'product_id',
      quantity: 1,
      price: 100,
      name: 'product_name',
    }
  */
    cart_products: {
      type: Array,
      default: [],
    },
    cart_count_products: {
      type: Number,
      default: 0,
    },
    cart_userId: {
      type: String,
      required: true,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: {
      createdAt: 'createdOn',
      updatedAt: 'modifyOn',
    },
  }
)

module.exports = model(DOCUMENT_NAME, cartSchema)
