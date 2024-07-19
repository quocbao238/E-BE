'use strict'

const _ = require('lodash')
const { Types } = require('mongoose')

const convertToObjectIdMongodb = (id) => {
  return new Types.ObjectId(id)
}

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

// support nested object
const updateNestedObjectParser = (obj) => {
  const newObj = {}
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      const nestedObj = updateNestedObjectParser(obj[key])
      Object.keys(nestedObj).forEach((nestedKey) => {
        newObj[`${key}.${nestedKey}`] = nestedObj[nestedKey]
      })
    } else {
      newObj[key] = obj[key]
    }
  })
  return newObj
}

module.exports = {
  getInfoData,
  getSelectData,
  unGetSelectData,
  removeUndefinedNull,
  updateNestedObjectParser,
  convertToObjectIdMongodb,
}
