'use strict'

const AccessService = require('../services/access.service')

const { SuccessReponse, CREATED } = require('../core/success.response')

class AccessController {
  login = async (req, res, next) => {
    new SuccessReponse({
      metadata: await AccessService.login(req.body),
    }).send(res)
  }

  signUp = async (req, res, next) => {
    new CREATED({
      message: 'Created shop successfully',
      metadata: await AccessService.signUp(req.body),
      options: {
        limit: '1',
      },
    }).send(res)
  }

  logout = async (req, res, next) => {
    new SuccessReponse({
      message: 'Logout successfully',
      metadata: await AccessService.logout(req.keyStore), // keystore get in middleware authentication
    }).send(res)
  }

  handleRefreshToken = async (req, res, next) => {
    new SuccessReponse({
      message: 'Refresh token successfully',
      metadata: await AccessService.handleRefreshTokenV2({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res)
  }
}

module.exports = new AccessController()
