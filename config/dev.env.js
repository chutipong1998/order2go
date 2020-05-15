'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_URL: '"https://order-with-local.web.app"',
  BASE_URL_API: '"https://asia-east2-order-with-local.cloudfunctions.net"',
})
