const config = require('../config')
const bcrypt = require(`bcrypt`)
const jwt = require('jsonwebtoken')

const AuthService = {
    getUserByEmail(db,email){
        return db.select('*').from('flp_user').where({email}).first()
    },
    comparePasswords(pass_plain,pass_hash){
        return bcrypt.compareSync(pass_plain,pass_hash)
    },
    createJwt(subject, payload){
        return jwt.sign(payload, config.SUPER_SECRET_PASS, {
            subject,
            algorithm: 'HS256'
        })
    },
    verifyJwt(token){
        return jwt.verify(
            token, 
            config.SUPER_SECRET_PASS, 
            {algorithms: ['HS256'],}
        )
    }
}

module.exports = AuthService