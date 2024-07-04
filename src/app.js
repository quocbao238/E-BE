require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const compression = require('compression')
const app = express()
const { checkOverload } = require('./helpers/check.connect')

// init middleware
app.use(morgan('dev'))
// Bảo mật ứng dụng bằng cách giúp chúng ta ẩn thông tin về ứng dụng http header
app.use(helmet())
// Nén dữ liệu trước khi gửi về client
app.use(compression())
// Sử dụng middleware để parse dữ liệu từ client
app.use(express.json())
// Mở rộng dữ liệu từ client
app.use(express.urlencoded({ extended: true }))

// init db
require('./dbs/init.mongodb')
// checkOverload();

// init routes
app.use('/', require('./routes'))

// handle errors
app.use((req, res, next) => {
  const error = new Error('Not found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  const statusCode = error.status || 500
  return res.status(statusCode).json({
    code: statusCode,
    status: 'error',
    stack: error.stack,
    message: error.message || 'Internal Server Error',
  })
})

module.exports = app
