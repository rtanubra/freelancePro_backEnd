const bcrypt = require('bcrypt')

const ClientsService ={
    getAllClients(db){
        return db.select('*').from('flp_clients').orderBy('id')
    },
    postClient(db,newClient){
        return db.insert(newClient).into('flp_clients').returning('*').first()

    },
    getClientByEmail(db,email){
        return db.select('*').from('flp_clients').where({email}).first()
    },
    getClientByPhone(db,phone){
        return db.select('*').from('flp_clients').where({phone}).first()
    }
}

module.exports = ClientsService