'use strict'

const redis = require('redis')
const { promisify } = require('util')
const redisClient = redis.createClient()
const InventoryRepo = require('../models/repositories/inventory.repo')

const pexpire = promisify(redisClient.pexpire).bind(redisClient)
const setnxAsync = promisify(redisClient.setnx).bind(redisClient)

const acquireLock = async (productId, quantity, cartId) => {
  const key = `lock_v2023:${productId}`
  const retryTimes = 10
  const expireTime = 3000 // 3 seconds
  for (let i = 0; i < retryTimes; i++) {
    // create key with expire time, who hold the key will have the lock
    const result = await setnxAsync(key, expireTime)
    // if result = 1, it means we get the lock
    // if result = 0, it means someone else hold the lock
    if (result === 1) {
      // handle inventory
      const isReversation = await InventoryRepo.reservationInventory({
        productId,
        cardId: cartId,
        quantity,
      })
      if (isReversation.modifiedCount) {
        // set expire time for the key
        await pexpire(key, expireTime)
        return key
      }
      return null
    } else {
      // wait for 50ms and try again
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
  }
}

const releaseLock = async (keyLock) => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient)
  return await delAsyncKey(keyLock)
}

module.exports = {
  acquireLock,
  releaseLock,
}
