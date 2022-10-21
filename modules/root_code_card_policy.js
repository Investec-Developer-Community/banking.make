module.exports = {

  // Converts simple flags into a JS bundle to deploy as RootCode
  build(sendEvents, approveTransactions, username, partition) {
    let token = username
    if (partition) { token += `/${partition}` }
    return `
const config = {
  approveTransactions: ${approveTransactions},
  sendEvents: ${sendEvents},
  eventUrl: "https://${process.env.DOMAIN}/investec/special/cards/events"
}

const beforeTransaction = async (transaction) => {
  return config.approveTransactions
};

const afterTransaction = async (transaction) => {
  if(config.sendEvents) {
    await Hub.createEvent('afterTransaction', transaction)
  }
};

const afterDecline = async (transaction) => {
  if(config.sendEvents) {
    await Hub.createEvent('afterDecline', transaction)
  }
};

const Hub = {
  createEvent: async function(event, data) {
    return await fetch(config.eventUrl, {
      method: 'POST',
      body: JSON.stringify({ event, data }),
      headers: {
        'Authorization': 'RootCard ${token}',
        'Content-Type': 'application/json'
      }
    })
  }
}
  `
  },
}