const Database = require("@replit/database");
const db = new Database();

const axios = require('axios')
const logError = (error) => console.log(error.toJSON())

// Uses Replit built-in database to handle a list of Power Automate flow subscriptions, and allows broadcasting of events to those subscribers via their provided webhooks

// TODO: rework this so that it doesn't hit replit's database limits. see: https://docs.replit.com/hosting/database-faq

class PowerAutomate {
  async resetSubscribers() {
    await db.set('subscribers', [])
  }

  async addSubscriber(username, partition, webhookURL) {
    let subscribers = await db.get('subscribers') || []
    subscribers.push({ username, partition, webhookURL })
    await db.set('subscribers', subscribers)
  }

  async getSubscribers(username = undefined, partition = undefined) {
    let subscribers = (await db.get('subscribers')) || []
    if (username) {
      subscribers = subscribers.filter(s => s.username == username)
      if (partition) {
        console.log(partition)
        subscribers = subscribers.filter(s => s.partition == partition)
      }
    }
    console.log(`Get subscribers: ${subscribers}`)
    return subscribers
  }

  async deleteSubscriber(webhookURL) {
    console.log(`Deleting subscriber ${webhookURL}`)
    let subscribers = await this.getSubscribers()
    subscribers = subscribers.filter(s => s.webhookURL != webhookURL)
    await db.set('subscribers', subscribers)
  }

  async notifySubscriber(webhookURL, data) {
    try {
      let response = await axios.post(webhookURL, data)
      return true
    } catch (error) {
      await this.deleteSubscriber(webhookURL)
    }
  }

  async notifySubscribers(username, partition, data) {
    let subscriber
    let subscribers = await this.getSubscribers(username, partition)
    // TODO make this an RSVP.all
    for (let i = 0; i < subscribers.length; i++) {
      subscriber = subscribers[i]
      await this.notifySubscriber(subscriber.webhookURL, data)
    }
    return true
  }
}

module.exports = PowerAutomate