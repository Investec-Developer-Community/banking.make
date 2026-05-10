const assert = require('assert')

const getAuth = require('../routes/investec/auth')
const Investec = require('../modules/investec')

async function testSandboxAuthHeader() {
  const req = {
    headers: {
      authorization: 'Basic SANDBOX'
    }
  }

  let calledNext = false
  getAuth(req, {}, () => { calledNext = true })

  assert.equal(calledNext, true)
  assert.deepEqual(req.currentUser, {
    username: 'SANDBOX',
    partition: undefined,
    token: 'SANDBOX'
  })
}

async function testSandboxAccounts() {
  const investec = new Investec('SANDBOX')
  const response = await investec.getWithAuth('/za/pb/v1/accounts')

  assert.equal(response.status, 200)
  assert.equal(response.data.data.accounts.length, 1)
  assert.equal(response.data.data.accounts[0].accountId, 'sandbox-account-1')
}

async function testSandboxBasicCredential() {
  const token = Buffer.from('SANDBOX:any-password').toString('base64')
  const { token: parsedToken, username, partition } = getAuth.splitPartitionFromToken(token)

  assert.equal(username, 'SANDBOX')
  assert.equal(partition, undefined)
  assert.equal(parsedToken, token)

  const investec = new Investec(parsedToken)
  const response = await investec.getWithAuth('/za/pb/v1/accounts')

  assert.equal(response.status, 200)
  assert.equal(response.data.data.accounts[0].referenceName, 'SANDBOX')
}

async function testSandboxTransactions() {
  const investec = new Investec(Buffer.from('SANDBOX:SANDBOX').toString('base64'))
  const response = await investec.getWithAuth('/za/pb/v1/accounts/sandbox-account-1/transactions')

  assert.equal(response.status, 200)
  assert.equal(response.data.data.transactions.length, 2)
  assert(response.data.data.transactions.every((transaction) => {
    return transaction.accountId === 'sandbox-account-1'
  }))
}

async function testUnknownSandboxEndpoint() {
  const investec = new Investec('SANDBOX')
  const response = await investec.getWithAuth('/za/pb/v1/accounts/unknown/transactions')

  assert.equal(response.status, 200)
  assert.deepEqual(response.data.data.transactions, [])
}

async function run() {
  await testSandboxAuthHeader()
  await testSandboxAccounts()
  await testSandboxBasicCredential()
  await testSandboxTransactions()
  await testUnknownSandboxEndpoint()
  console.log('investec sandbox tests passed')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
