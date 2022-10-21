const cardPartitions = [
  // (optional): partitions are like subfolders on an account
  // they limit the cards that can be seen
  // and any cards with Root Code policies set from within a
  // partition will only trigger CardSpend events on Power Automate
  // for that partitioned account
  {
    // Dan's personal card on Dan's account
    partitionedUsername: "IWuq3rDLDz1zgciHPwS02hd8Rs3SLNLS/1",
    card: "402167XXXXXX1017"
  },
  // {
  //   another one goes here
  // },
]

module.exports = cardPartitions
