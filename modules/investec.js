const axios = require('axios')
const InvestecSandbox = require('./investec_sandbox')
const logError = (error) => console.log(error.toJSON())

// Simple adapter to fetch bearer tokens and proxy requests to Investec's API

class Investec {
  credentials = null
  authToken = null

  constructor(credentials) {
    this.credentials = credentials

    if (this.isSandboxCredentials(credentials)) {
      return new InvestecSandbox()
    }
  }

  isSandboxCredentials(credentials) {
    if (!credentials) { return false }
    if (credentials === 'SANDBOX') { return true }

    try {
      const decoded = Buffer.from(credentials, 'base64').toString()
      return decoded.split(':').includes('SANDBOX')
    } catch {
      return false
    }
  }

  async getAuthToken() {
    try {
      var response = await axios.post(
        "/identity/v2/oauth2/token",
        "grant_type=client_credentials",
        {
          baseURL: 'https://openapi.investec.com',
          headers: {
            Authorization: `Basic ${this.credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      ).catch(logError)

      this.authToken = response.data.access_token
    } catch {
      console.log("Error fetching auth token")
      this.authtoken = null
    }
  }

  axiosConfig() {
    let config = {
      baseURL: 'https://openapi.investec.com'
    }
    if (this.authToken) {
      config.headers ||= {}
      config.headers['Authorization'] = `Bearer ${this.authToken}`
    }
    return config
  }

  async get(path) {
    return await axios.get(path, this.axiosConfig()).catch(logError)
  }

  async getWithAuth(path) {
    await this.getAuthToken()
    return await axios.get(path, this.axiosConfig()).catch(logError)
  }

  async postWithAuth(path, params) {
    await this.getAuthToken()
    return await axios.post(path, params, this.axiosConfig()).catch(logError)
  }
}

module.exports = Investec

