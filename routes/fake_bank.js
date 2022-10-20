// Extracted this but it's not wired up properly any more...


const accountId = "822213379942069"

const transactionsRaw = `1,25/05/2022,PRANCING PONY TAVERN,-550,2898230
2,20/05/2022,MILTARY PAYROLL,-200000,2898780
3,19/05/2022,ROHAN AID,-100000,3098780
4,18/05/2022,GNOMMIES DAY CARE,-5000,3198780
5,18/05/2022,FARMERS LAND LEVIES,10000,3203780
6,18/05/2022,MINAS TIRITH MASONS,-5000,3193780
7,18/05/2022,PIPPIN TOOK - FOR DAMAGES TO THRONE,3000,3198780
8,15/05/2022,MISADVENTURES BOUNTY,98500,3195780
9,13/05/2022,HOW TO SPEAK GOOD TO YOUR SUBJECTS,-1500,3097280
10,11/05/2022,BLACKSMITH R&D,-25000,3098780
11,10/05/2022,LADY GALADRIEL GIFT,-4500,3123780`

let transactionRows = transactionsRaw.split('\n')
let transactions = transactionRows.map(transaction => {
  let [postedOrder, transactionDate, description, amount, runningBalance] = transaction.split(',')

  amount = parseInt(amount)
  runningBalance = parseInt(runningBalance)
  const type = amount > 0 ? "CREDIT" : "DEBIT"
  return { accountId, postedOrder, type, transactionDate, description, amount, runningBalance }
})

app.get('/transactions', async (_req, _res) => {
  _res.json(transactions)
})

app.get('/transactions/latest', async (_req, _res) => {
  _res.json(transactions[0])
})

app.get('/account_balance', async (_req, _res) => {
  const currentBalance = transactions[0].runningBalance
  const availableBalance = currentBalance
  const currency = "ZAR"
  _res.json({ accountId, currentBalance, availableBalance, currency })
})
