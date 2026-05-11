const accountId = 'sandbox-account-1'

const accounts = [
  {
    accountId,
    accountNumber: '10000000001',
    accountName: 'SANDBOX Private Bank Account',
    referenceName: 'SANDBOX',
    productName: 'Private Bank Account'
  }
]

const transactions = [
  {
    accountId,
    type: 'DEBIT',
    transactionType: 'CardPurchases',
    status: 'POSTED',
    description: 'SANDBOX COFFEE SHOP',
    cardNumber: '400000******0001',
    postedOrder: 1,
    postingDate: '2024-01-15',
    transactionDate: '2024-01-15',
    actionDate: '2024-01-15',
    transactionTime: '09:31:00',
    amount: -4500,
    runningBalance: 125500
  },
  {
    accountId,
    type: 'CREDIT',
    transactionType: 'Deposit',
    status: 'POSTED',
    description: 'SANDBOX SALARY',
    postedOrder: 2,
    postingDate: '2024-01-01',
    transactionDate: '2024-01-01',
    actionDate: '2024-01-01',
    transactionTime: '08:00:00',
    amount: 130000,
    runningBalance: 130000
  }
]

const balance = {
  accountId,
  currentBalance: 125500,
  availableBalance: 125500,
  currency: 'ZAR'
}

function response(data, status = 200) {
  return { status, data }
}

function sandboxUrl(path) {
  return new URL(path, 'https://sandbox.banking.make')
}

function matchesDateRange(transaction, fromDate, toDate) {
  const date = transaction.transactionDate || transaction.postingDate
  return (!fromDate || date >= fromDate) && (!toDate || date <= toDate)
}

function filterTransactions(requestedAccountId, params) {
  const fromDate = params.get('fromDate')
  const toDate = params.get('toDate')
  const transactionType = params.get('transactionType')

  return transactions.filter((transaction) => {
    return transaction.accountId === requestedAccountId &&
      matchesDateRange(transaction, fromDate, toDate) &&
      (!transactionType || transaction.transactionType === transactionType)
  })
}

class InvestecSandbox {
  async getWithAuth(path) {
    const url = sandboxUrl(path)

    if (url.pathname === '/za/pb/v1/accounts') {
      return response({ data: { accounts } })
    }

    const balanceMatch = url.pathname.match(/^\/za\/pb\/v1\/accounts\/([^/]+)\/balance$/)
    if (balanceMatch) {
      const requestedAccountId = balanceMatch[1]
      if (requestedAccountId !== accountId) {
        return response({
          data: {
            message: 'Sandbox account not found',
            accountId: requestedAccountId
          }
        }, 404)
      }

      return response({ data: balance })
    }

    const transactionsMatch = url.pathname.match(/^\/za\/pb\/v1\/accounts\/([^/]+)\/transactions$/)
    if (transactionsMatch) {
      const requestedAccountId = transactionsMatch[1]
      return response({
        data: {
          transactions: filterTransactions(requestedAccountId, url.searchParams)
        }
      })
    }

    return response({
      data: {
        message: 'Sandbox endpoint not implemented',
        path
      }
    }, 404)
  }

  async postWithAuth(path, params) {
    return response({
      data: {
        message: 'Sandbox POST endpoint not implemented',
        path,
        params
      }
    }, 404)
  }
}

module.exports = InvestecSandbox
