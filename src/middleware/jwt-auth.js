const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const AuthService = require(`../auth/auth-service`)

function requireAuth(jsonBodyParser,req, res, next) {
    const authToken = req.get('Authorization') || ''
    let bearerToken
    if (!authToken.toLowerCase().startsWith('bearer ')) {
       return res.status(401).json({ error: 'Missing bearer token' })
    } else {
      bearerToken = authToken.slice(7, authToken.length)
    }
    try {
      AuthService.verifyJwt(bearerToken)
       next()
    } catch(error) {
      res.status(401).json({ error: 'Unauthorized request' })
    }   
    next()
}

module.exports = {
  requireAuth,
}
