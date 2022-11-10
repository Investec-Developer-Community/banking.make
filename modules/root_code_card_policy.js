function getListFromCommaSeparatedString(commaSeparatedString) {
  if (!commaSeparatedString) {
    return [];
  }
  return commaSeparatedString
    .split(",")
    .map(s => s.trim());
}

module.exports = {

  // Converts simple flags into a JS bundle to deploy as RootCode
  build(
    sendEvents,
    approveTransactions,
    username,
    partition,
    allowlist,
    blocklist
  ) {
    let token = username
    if (partition) { token += `/${partition}` }
    const allowlistString = JSON.stringify(getListFromCommaSeparatedString(allowlist));
    const blocklistString = JSON.stringify(getListFromCommaSeparatedString(blocklist));
    return `
const config = {
  approveTransactions: ${approveTransactions},
  sendEvents: ${sendEvents},
  eventUrl: "https://${process.env.DOMAIN}/investec/special/cards/events"
}

const verifyMerchantIsAllowed = (merchantCode) => {
  if (${allowlistString}.length === 0) {
    return true;
  }
  return ${allowlistString}.indexOf(merchantCode) !== -1;
}

const verifyMerchantIsNotBlocked = (merchantCode) => {
  if (${blocklistString}.length === 0) {
    return true;
  }
  return ${blocklistString}.indexOf(merchantCode) === -1;
}

const beforeTransaction = async (transaction) => {
  return config.approveTransactions
    && verifyMerchantIsAllowed(transaction.merchant.category.code)
    && verifyMerchantIsNotBlocked(transaction.merchant.category.code);
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

