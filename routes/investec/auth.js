function splitPartitionFromToken(partitionedToken) {
  const partitionedCredentials = new Buffer(partitionedToken, 'base64').toString()
  const [partitionedUsername, password] = partitionedCredentials.split(":")
  const [username, partition] = partitionedUsername.split("/")
  const token = (new Buffer.from(`${username}:${password}`)).toString('base64')
  return { token, username, partition }
}

function getAuth(_req, _res, next) {
  let [authType, partitionedToken] = _req.headers.authorization.split(" ")

  if (authType == "Basic") {
    let { token, username, partition } = splitPartitionFromToken(partitionedToken)
    _req.currentUser = { username, partition, token }
    console.log(_req.currentUser)
  }

  if (authType == "RootCard") {
    let [username, partition] = partitionedToken.split("/")
    if (partition == '') { partition = undefined }
    _req.currentUser = { username, partition }
  }

  next()
}

module.exports = getAuth
