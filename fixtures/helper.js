const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../src/config')


function makeAuthHeader(user, secret = config.SUPER_SECRET_PASS) {

   const token = jwt.sign({user_id:user.id ,email: user.email }, secret, {
     subject: user.email,
     algorithm: 'HS256',
   })
   return `Bearer ${token}`

}

module.exports = {
    makeAuthHeader
}