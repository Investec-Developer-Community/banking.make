const assert = require('assert')
const Investec = require('../modules/investec')
const getAuth = require('../routes/investec/auth')

async function testSandboxAdapter() {
  const sandbox = new Investec('SANDBOX')

  const accountsResponse = await sandbox.getWithAuth('/za/pb/v1/accounts')
  assert.strictEqual(accountsResponse.status, 200)
  assert.strictEqual(accountsResponse.data.data.accounts.length, 1)

  const accountId = accountsResponse.data.data.accounts[0].accountId
  const transactionsResponse = await sandbox.getWithAuth(`/za/pb/v1/accounts/${accountId}/transactions`)
  assert.strictEqual(transactionsResponse.status, 200)
  assert.strictEqual(transactionsResponse.data.data.transactions.length, 2)

  const missingResponse = await sandbox.getWithAuth('/za/pb/v1/cards')
  assert.strictEqual(missingResponse.status, 404)
  assert.strictEqual(missingResponse.data.data.path, '/za/pb/v1/cards')
}

function testSandboxAuthHeader() {
  const req = {
    headers: { authorization: 'Basic SANDBOX' }
  }

  getAuth(req, {}, () => {})

  assert.deepStrictEqual(req.currentUser, {
    username: 'SANDBOX',
    partition: undefined,
    token: 'SANDBOX'
  })
}

async function run() {
  await testSandboxAdapter()
  testSandboxAuthHeader()
}

run()
