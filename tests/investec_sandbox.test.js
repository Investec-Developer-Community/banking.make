const test = require('node:test')
const assert = require('node:assert/strict')

const Investec = require('../modules/investec')
const InvestecSandbox = require('../modules/investec_sandbox')

test('Investec switches to sandbox mode when Basic credentials include SANDBOX', () => {
  const credentials = Buffer.from('SANDBOX:SANDBOX').toString('base64')
  const investec = new Investec(credentials)

  assert.ok(investec instanceof InvestecSandbox)
})

test('sandbox returns accounts in the Investec response envelope', async () => {
  const sandbox = new InvestecSandbox()
  const response = await sandbox.getWithAuth('/za/pb/v1/accounts')

  assert.equal(response.status, 200)
  assert.deepEqual(response.data.data.accounts, [
    {
      accountId: 'sandbox-account-1',
      accountNumber: '10000000001',
      accountName: 'SANDBOX Private Bank Account',
      referenceName: 'SANDBOX',
      productName: 'Private Bank Account'
    }
  ])
})

test('sandbox returns transactions and applies query filters', async () => {
  const sandbox = new InvestecSandbox()
  const response = await sandbox.getWithAuth(
    '/za/pb/v1/accounts/sandbox-account-1/transactions?fromDate=2024-01-10&transactionType=CardPurchases'
  )

  assert.equal(response.status, 200)
  assert.deepEqual(
    response.data.data.transactions.map(transaction => transaction.description),
    ['SANDBOX COFFEE SHOP']
  )
})

test('sandbox returns a balance for the sandbox account', async () => {
  const sandbox = new InvestecSandbox()
  const response = await sandbox.getWithAuth('/za/pb/v1/accounts/sandbox-account-1/balance')

  assert.equal(response.status, 200)
  assert.deepEqual(response.data.data, {
    accountId: 'sandbox-account-1',
    currentBalance: 125500,
    availableBalance: 125500,
    currency: 'ZAR'
  })
})
