// A simple server that proxies only specific methods to an Ethereum JSON-RPC
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const _ = require('lodash')

const ALLOWED_METHODS = ['eth_sendBundle']

function validPort(port) {
  if (isNaN(port) || port < 0 || port > 65535) {
    return false
  }

  return true
}

const PUBLIC_PORT = parseInt(process.env.PUBLIC_PORT || '18545')
const GETH_PORT = parseInt(process.env.GETH_PORT || '8545')
const GETH_URL = process.env.GETH_URL || 'http://localhost'
const API_KEYS = []
if (process.env.API_KEYS) {
  API_KEYS = _.split(process.env.API_KEYS, ',')
}

if (!validPort(PUBLIC_PORT)) {
  console.error(`invalid port specified for PUBLIC_PORT: ${PUBLIC_PORT}`)
  process.exit(1)
}
if (!validPort(GETH_PORT)) {
  console.error(`invalid port specified for GETH_PORT: ${GETH_PORT}`)
  process.exit(1)
}

const app = express()
app.use(bodyParser.json())

app.use(function (req, res) {
  if (!req.body) {
    res.writeHead(400)
    res.end('invalid json body')
    return
  }
  if (!req.body.method) {
    res.writeHead(400)
    res.end('missing method')
    return
  }
  if (!_.includes(ALLOWED_METHODS, req.body.method)) {
    res.writeHead(400)
    res.end(`invalid method, only ${ALLOWED_METHODS} supported, you provided: ${req.body.method}`)
    return
  }

  const apiKey = req.header('API-Key')

  if (!apiKey) {
    res.writeHead(400)
    res.end('missing API-Key header')
    return
  }

  if (!_.includes(API_KEYS, apiKey)) {
    res.writeHead(400)
    res.end(`invalid API-Key header`)
    return
  }

  request
    .post({
      url: `${GETH_URL}:${GETH_PORT}`,
      body: JSON.stringify(req.body),
      headers: { 'Content-Type': 'application/json' }
    })
    .on('error', function (e) {
      res.writeHead(500)
      res.end(`error in proxy: ${e}`)
    })
    .pipe(res)
})

app.listen(PUBLIC_PORT, () => {
  console.log(`proxy listening at ${PUBLIC_PORT} and forwarding to ${GETH_URL}:${GETH_PORT}`)
})
