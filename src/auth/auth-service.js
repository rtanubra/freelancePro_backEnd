const config = require('../config')
const bcrypt = require(`bcrypt`)

const AuthService = {
    getUserByEmail(db,email){
        return db.select('*').from('flp_user').where({email}).first()
    },
    comparePasswords(pass_plain,pass_hash){
        return bcrypt.compareSync(pass_plain,pass_hash)
    }
}

module.exports = AuthService