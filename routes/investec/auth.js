function sandboxUser() {
  return { token: 'SANDBOX', username: 'SANDBOX', partition: undefined }
}

function splitPartitionFromToken(partitionedToken) {
  // pulls out an optional partition (subfolder) from API credentials
  // which is used when filtering Investec API responses to show only
  // certain cards

  if (partitionedToken === 'SANDBOX') {
    return sandboxUser()
  }

  const partitionedCredentials = Buffer.from(partitionedToken, 'base64').toString()
  if (partitionedCredentials === 'SANDBOX') {
    return sandboxUser()
  }

  const [partitionedUsername, password] = partitionedCredentials.split(":")
  const [username, partition] = partitionedUsername.split("/")
  const token = Buffer.from(`${username}:${password}`).toString('base64')
  return { token, username, partition }
}

function getAuth(_req, _res, next) {
  if (!_req.headers.authorization) {
    return next()
  }

  let [authType, partitionedToken] = _req.headers.authorization.split(" ")

  if (authType == "Basic") {
    let { token, username, partition } = splitPartitionFromToken(partitionedToken)
    _req.currentUser = { username, partition, token }
  }

  if (authType == "RootCard") {
    let [username, partition] = partitionedToken.split("/")
    if (partition == '') { partition = undefined }
    _req.currentUser = { username, partition }
  }

  next()
}

module.exports = getAuth
