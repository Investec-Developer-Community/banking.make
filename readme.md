# Bounties Playground | banking.make.dev

The **Programmable Banking Community** is a community of 800+ software devs on a mission.
We want to make Programmable Banking a reality for South African developers and businesses: by building open-source tech with Investec Programmable Banking foundations. [Learn more here](https://offerzen.gitbook.io/programmable-banking-community-wiki/).

# What is this repo about?

This repo is a community space for playing with programmable banking, and building/extending its API functionality. We hope that anyone interested in building useful financial tools can use this repo to increase functionality for personal and business use-cases.


## What do I need to know?

### Bounties 

- ⏰ Each bounty season will run **over three weekends**. 
  - ~~_Season #1_: Starts 27 October and ends 14 November 2022 🏁~~
  - ~~_Season #2_: Starts 15 November and ends 5 December 2022 🏁~~
  - _Season #3_: Starts 1 January 2023 and ends [TBC] 🏁

We have a list of bounties for functionality that we think will be useful to add.

- 👉 Check out [available bounties as a starting point](https://github.com/programmable-banking-community/banking.make/issues?q=is%3Aissue+is%3Aopen+label%3Abounty)!
- 👉  If you have an idea for a new bounty; [let us know here](https://forms.gle/rd1LBgNaf3JnZ2uP7) (_it may get included for next season_ 😉)

__What do I do when I find a bounty I like?__
- If you see one that you like, comment that you want to claim it. The person that created the bounty will respond with a **"go-ahead 👍"**.
- You can clone this repo and work on your local machine. 

💡 __ProTip:__ We recommend [forking our REPL on Replit](https://replit.com/@OfferZenMake/programmable-banking) for a quick-start. Replit is a great dev tool that makes it easy to run and edit code.

- Write the necessary code or documentation in your fork.
- Create a pull request into the main GitHub repo with your changes.
- Once your code is merged into the master app, you'll receive your bounty reward. 🏆


__Where do I get support?__
- Great question! Drop into the [dedicated bounties Slack channel here](https://offerzen-community.slack.com/archives/C048GPNT49W). We'll be more than happy to help with any questions or support around your bounties build/ the bounties in general/ or if you just want to hang out and help others. 

💡 __ProTip:__ If you learn something interesting while working in the codebase, be sure to add it in `./knowledge` so everyone can benefit!

### Adding Other features

**Feel free to extend this app with other programmable banking features you'd like.** We can't guarantee it'll be merged into the main branch, but if it provides real value there's a good chance it will be. Please make sure your code is well documented and it's reason for existing is explained well.

### Issue tracking
[Report any issues on GitHub](https://github.com/programmable-banking-community/banking.make/issues/new)


## Getting set up
- Fork the code - either from this [REPL directly](https://replit.com/@OfferZenMake/programmable-banking) or [from GitHub](http://github.com/programmable-banking-community/banking.make/issues/new) if you prefer to work locally
- Configure the app's components to point to the domain your REPL is hosted at
  - Set the `DOMAIN` secret, the default is `banking.make.dev` - this is used in the root code compiler among others
  - Update the connector file in `public/Investec.swagger.json` and replace `banking.make.dev`
- `npm install` and `npm start` (I think, not sure - I just use Replit and it auto-boots)


## Current Features

### Investec API
- `routes/investec.js` proxies any incoming `GET` and `POST` requests to the Investec API while converting API keys into single-use bearer tokens. The app doesn't store any sensitive information.
- `routes/investec/auth.js` contains middleware to extract partition information from API keys, if the requester is using partitioned access and `routes/investec/card_partitions.js` contains config for those partitions
- `routes/investec/special.js` extends Investec API base functionality by providing an abstraction layer for card control, handling card events, and simplifying the transfer endpoint


### RootCode card control
- `modules/root_code_card_policy.js` converts simple config flags into a JS bundle that can be compiled as RootCode onto a supported card
- The path `/special/cards/{cardKey}/policy` accepts optional body params `allowlist` & `blocklist` as a comma-separated list of merchant codes. A list of merchant codes and descriptions can be found at the path `/za/v1/cards/merchants`. [View a demo of it in action here](https://www.loom.com/share/e6e8707b892044f1a12a5eb00195ee18)


### Power Automate
- There is a connector file in `public/Investec.swagger.json` that you can import into [Microsoft Power Automate](https://make.powerautomate.com) or any other low-code tool
- `modules/power_automate.js` handles pubsub subscriptions for PowerAutomate events
- `routes/investec/special.js` contains several routes specific to Power Automate

---

# FAQs

1. **Can >1 person work on/request to work on a bounty at the same time? How is the decision about who works on it made?**
          -Anyone can go after any bounty - it just depends on who commits first with all the correct criteria.
3. **Is there any time frame for the bounties to be completed in?**
          -Yes, there is. There are Bounty seasons - 3 weekends per bounty season.
3. **What is the engagement model once someone has started working on a bounty?**
          -You can either work on your own and commit for approval as is, or they can join the [Slack channel #03_community-bounties](https://offerzen-community.slack.com/archives/C048GPNT49W) for support and to book a "build session" with a community champion.
4. **What if the person cannot complete the bounty?**
          -Then they don’t complete. We’ll make a call after each season to either roll over any unclaimed bounties and add new ones for the next seasons.
