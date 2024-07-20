'use strict'

const { model, Schema } = require('mongoose') // Erase if already required

const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'Orders'
// Declare the Schema of the Mongo model
var orderSchema = new Schema(
  {
    order_userId: {
      type: Number,
      required: true,
    },
    /*
        order_checkout: {
            totalPrice: 0, // total price of all products
            totalApplyDiscount: 0, // total discount of all products
            feeShip: 0, // fee shipping
        }
    */
    order_checkout: {
      type: Object,
      default: {},
    },
    /*
        street,
        city,
        state,
        country,
    */
    order_shipping: {
      type: Object,
      default: {},
    },
    order_payment: {
      type: Object,
      default: {},
    },
    // is shop_order_ids_new
    order_products: {
      type: Array,
      default: [],
      required: true,
    },
    order_trackingNumber: {
      type: String,
      default: '#000120052024',
    },
    order_status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'],
      default: 'pending',
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
)

//Export the model
module.exports = model(DOCUMENT_NAME, orderSchema)
