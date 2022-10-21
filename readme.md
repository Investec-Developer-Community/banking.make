# banking.make.dev

This repo is a community space for building and extending programmable banking API functionality.


## Features
### Investec API
- `routes/investec.js` proxies any incoming `GET` and `POST` requests to the investec API while converting API keys into single-use bearer tokens. The app doesn't store any sensitive information.
- `routes/investec/auth.js` contains middleware to extract partition information from API keys, if the requester is using partitioned access and `routes/investec/card_partitions.js` contains config for those partitions
- `routes/investec/special.js` extends Investec API base functionality by providing an abstraction layer for card control, handling card events, and simplifying the transfer endpoint


### RootCode card control
- `modules/root_code_card_policy.js` converts simple config flags into a JS bundle that can be compiled as RootCode onto a supported card

### Power Automate
- There is a connector file in `public/Investec.swagger.json` that you can import into [Microsoft Power Automate](https://make.powerautomate.com) or any other low-code tool
- `modules/power_automate.js` handles pubsub subscriptions for PowerAutomate events
- `routes/investec/special.js` contains several routes specific to Power Automate


## Getting set up
- Fork this REPL
- Configure the app's components to point to **the domain your REPL is hosted at**
  - Set the `DOMAIN` secret, the default is `banking.make.dev` - this is used in the root code compiler among others
  - Update the connector file in `public/Investec.swagger.json` and replace `banking.make.dev`

## How to contribute

### Bounties
- Once you're forked the app and have it booting, check out (TODO ALGORA LINK) for open app bounties.
- Claim a bounty and complete it by creating a pull request to the main repo.
- Once your code is merged into the master app, you'll receive your bounty reward

TODO: Something around adding stuff in `dev notes` and changelog and stuff

### Issue tracking
Report any issues on the GitHub page. (TODO LINK)

### Other features
Feel free to extend the app with other programmable banking features you'd like. We can't guarantee it'll be merged but if it provides real value there's a good chance it will be. Please make sure your code is well documented and it's reason for existing is explained well.


## Important links
- Slack
- GitHub
- ..


