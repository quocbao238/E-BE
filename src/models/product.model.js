'use strict'

const { model, Schema } = require('mongoose') // Erase if already required
const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const jsonTestCreateProduct = {
  product_name: 'Iphone 112',
  product_thumb: 'https://www.google.com',
  product_description: 'Iphone 12',
  product_price: 1000,
  product_quantity: 10,
  product_type: 'Electronic',
  product_shop: '{{x-client-id}}',
  product_attributes: {
    manufacturer: 'Apple',
    model: 'Iphone 12',
    color: 'Black',
  },
}

var productSchema = new Schema(
  {
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: {
      type: String,
      required: true,
      enum: ['Clothing', 'Electronic'],
    },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    product_attributes: { type: Schema.Types.Mixed, required: true },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
)

// defind the product type Clothing

const clothingSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
  },
  {
    timestamps: true,
    collection: 'Clothings',
  }
)

const electronicSchema = new Schema(
  {
    manufacturer: { type: String, required: true },
    model: String,
    color: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
  },
  {
    timestamps: true,
    collection: 'Electronics',
  }
)

//Export the model
module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  clothing: model('Clothing', clothingSchema),
  electronic: model('Electronic', electronicSchema),
}
