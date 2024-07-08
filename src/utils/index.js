'use strict'

const _ = require('lodash')

const getInfoData = ({ fileds = [], object = {} }) => {
  return _.pick(object, fileds)
}

//  ['a','b'] => {a: 1, b: 1}
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((item) => [item, 1]))
}

const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map((item) => [item, 0]))
}

// remove undefind and null value from object
const removeUndefinedNull = (obj) => {
  return _.pickBy(obj, _.identity)
}

/**
 * Remove undefined values from object
 * Before:
 const a = {
  c: {
    d:1  
  }
 }
  db.collection.updateOne(
    { _id: 1 },
    { $set: { 'a.b': 1 } }
  )
    
 */
const updateNestedObject = (object, path, value) => {
  const keys = path.split('.')
  const lastKey = keys.pop()
  const lastObj = keys.reduce((obj, key) => (obj[key] = obj[key] || {}), object)
  lastObj[lastKey] = value
  return object
}

module.exports = {
  getInfoData,
  getSelectData,
  unGetSelectData,
  removeUndefinedNull,
  updateNestedObject,
}
