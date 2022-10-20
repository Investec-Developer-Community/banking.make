const axios = require('axios')

function buildClient(webhookURL) {
  const axiosConfig = {}
  
  const logError = (error) => console.log(error)
  
  const client = {
    post: async(params) => await axios.post(webhookURL, params, axiosConfig).catch(logError)
  }

  return {
    ...client,
    postMessage: async function(text) {
      return await client.post({ text })
    },
    postRichMessage: async function(data) {
      return await client.post(data)
    }
  }
}


module.exports = { buildClient }
