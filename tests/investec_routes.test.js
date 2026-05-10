const assert = require('assert')
const http = require('http')

const express = require('express')

function createApp() {
  const app = express()
  app.use(express.urlencoded({ extended: false }))
  app.use(express.json())
  app.use('/investec', require('../routes/investec'))
  return app
}

function listen(app) {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, '127.0.0.1')
    server.once('listening', () => resolve(server))
    server.once('error', reject)
  })
}

function requestJson(server, path) {
  const { port } = server.address()

  return new Promise((resolve, reject) => {
    const request = http.request({
      hostname: '127.0.0.1',
      port,
      path,
      method: 'GET',
      headers: {
        authorization: 'Basic SANDBOX'
      }
    }, (response) => {
      let body = ''
      response.setEncoding('utf8')
      response.on('data', chunk => { body += chunk })
      response.on('end', () => {
        try {
          resolve({
            statusCode: response.statusCode,
            body: JSON.parse(body)
          })
        } catch (error) {
          reject(error)
        }
      })
    })

    request.once('error', reject)
    request.end()
  })
}

async function run() {
  const server = await listen(createApp())

  try {
    const accounts = await requestJson(server, '/investec/za/pb/v1/accounts')
    assert.equal(accounts.statusCode, 200)
    assert.equal(accounts.body.data.accounts.length, 1)
    assert.equal(accounts.body.data.accounts[0].accountId, 'sandbox-account-1')

    const transactions = await requestJson(
      server,
      '/investec/za/pb/v1/accounts/sandbox-account-1/transactions?fromDate=2024-01-01&toDate=2024-01-31'
    )
    assert.equal(transactions.statusCode, 200)
    assert.equal(transactions.body.data.transactions.length, 2)
    assert(transactions.body.data.transactions.every((transaction) => {
      return transaction.accountId === 'sandbox-account-1'
    }))

    console.log('investec route tests passed')
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve())
    })
  }
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
