const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {

   const token = jwt.sign({ email: user.email }, secret, {
     subject: user.email,
     algorithm: 'HS256',
   })

   return `Bearer ${token}`

}

module.exports = {
    makeAuthHeader
}