// This file extends the Investec API with niche features
// and some adapting to make it work well with PowerAutomate
// Ideally, this file should be as small as possible and the Investec
// APIs should be worked with directly, but that's not always feasible

const router = require('express').Router()
const cardPolicy = require('../../modules/root_code_card_policy')
const PowerAutomate = require('../../modules/power_automate')
const Investec = require('../../modules/investec')

router.post('/cards/:cardKey/policy', async (_req, _res) => {
  console.log(_req.body)
  const investec = new Investec(_req.currentUser.token)
  const code = cardPolicy.build(_req.body.sendEvents, _req.body.approveTransactions, _req.currentUser.username, _req.currentUser.partition)

  const cardKey = _req.params.cardKey
  const saveCodeResponse = await investec.postWithAuth(`/za/v1/cards/${cardKey}/code`, { code })
  const codeId = saveCodeResponse.data.data.result.codeId
  const publishCodeResponse = await investec.postWithAuth(`/za/v1/cards/${cardKey}/publish`, { codeId })

  _res.status(publishCodeResponse.status)
  _res.json({ status: publishCodeResponse.status })
})


router.post('/cards/events', async (_req, _res) => {
  let data = _req.body.data

  let params = {
    event: _req.body.event,
    date_time: data.dateTime,
    card_id: data.card.id,
    card_display: data.card.display,
    amount: (data.centsAmount / 100),
    account_number: data.accountNumber,
    merchant_category_code: data.merchant.category.code,
    merchant_category_key: data.merchant.category.key,
    merchant_category_name: data.merchant.category.name,
    merchant_name: data.merchant.name,
    merchant_city: data.merchant.city,
    merchant_country_code: data.merchant.country.code,
    merchant_country_alpha3: data.merchant.country.alpha3,
    merchant_country_name: data.merchant.country.name
  }

  const powerAutomate = new PowerAutomate()
  await powerAutomate.notifySubscribers(_req.currentUser.username, _req.currentUser.partition, params)

  _res.json({ ok: true })
})


router.post('/cards/events/subscriptions/power_automate', async (_req, _res) => {
  const powerAutomate = new PowerAutomate()
  await powerAutomate.addSubscriber(_req.currentUser.username, _req.currentUser.partition, _req.body.TriggerUrl)
  _res.json({ ok: true })
})

router.post('/accounts/:accountId/transfer', async (_req, _res) => {
  // PowerAutomate says that a JSON array request is not valid
  // so we have to do this adapting to make it work
  console.log(_req.body)
  const investec = new Investec(_req.currentUser.token)
  const transferInstructions = [
    // TODO convert these to capitalized versions on the connector
    // to match the API
    {
      'BeneficiaryAccountId': _req.body.beneficiaryAccountId,
      'Amount': _req.body.amount,
      'MyReference': _req.body.myReference,
      'TheirReference': _req.body.theirReference
    }
  ]

  const response = await investec.postWithAuth(`/za/pb/v1/accounts/transfermultiple`, {
    AccountId: _req.params.accountId,
    TransferList: transferInstructions
  })

  _res.status(response.status)
  _res.json(response.data)
})

module.exports = router