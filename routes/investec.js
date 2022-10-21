const router = require('express').Router()

router.use(require('./investec/auth'))
router.use('/special', require('./investec/special'))

const Investec = require('../modules/investec')
const cardPartitions = require('./investec/card_partitions')

// This route is not a pure proxy because we want to filter the results if there is a partition i.e. when sharing a single account with many users while only showing them particular cards
router.get('/za/v1/cards', async (_req, _res) => {
  const investec = new Investec(_req.currentUser.token)
  const response = await investec.getWithAuth(`/za/v1/cards`)

  let cards = response.data.data.cards

  // filter out any cards that aren't granted to this partition,
  // if such a partition exists
  if (_req.currentUser.partition) {
    const partitionedUsername = [_req.currentUser.username, _req.currentUser.partition].join("/")
    const partitionRule = cardPartitions.find(p => p.partitionedUsername == partitionedUsername)
    if (partitionRule) {
      cards = cards.filter(c => c.CardNumber == partitionRule.card)
    }
  }

  _res.json({ data: cards })
})

// proxies any GET request to the investec adapter
// with a valid bearer token added in
router.get('/*', async (_req, _res) => {
  const investec = new Investec(_req.currentUser.token)
  const response = await investec.getWithAuth(_req.url)
  _res.json(response.data)
})

// proxies any POST request to the investec adapter
// with a valid bearer token added in
router.post('/*', async (_req, _res) => {
  const investec = new Investec(_req.currentUser.token)
  const response = await investec.postWithAuth(_req.url, _req.body)
  _res.json(response.data)
})

module.exports = router