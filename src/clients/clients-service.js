const bcrypt = require('bcrypt')

const ClientsService ={
    getAllClients(db){
        return db.select('*').from('flp_clients').orderBy('id')
    }
}

module.exports = ClientsService