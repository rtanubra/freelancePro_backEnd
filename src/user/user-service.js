const bcrypt = require('bcrypt')

const UserService = {
    getAllUser(db){
        return db.select('*').from('flp_user').orderBy('id')
    }
}

module.exports = UserService