const bcrypt = require('bcrypt')

const ClientsService ={
    getAllClients(db){
        return db.select('*').from('flp_clients').orderBy('id')
    },
    postClient(db,newClient){
        return db.insert(newClient).into('flp_clients').returning('*')

    },
    getClientByEmail(db,email){
        return db.select('*').from('flp_clients').where({email}).first()
    },
    getClientByPhone(db,phone){
        return db.select('*').from('flp_clients').where({phone}).first()
    },
    getClientById(db,id){
        return db.select('*').from('flp_clients').where({id}).first()
    },
    deleteById(db,id){
        return db('flp_clients').where({id}).delete()
    },
    updateById(db,id,newItem){
        return db('flp_clients').where({id}).update(newItem).returning('*')
    }
}

module.exports = ClientsService