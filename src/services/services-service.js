const bcrypt = require('bcrypt')

const ServiceService = {
    getAllServices(db){
        return db.select('*').from('flp_services').orderBy('id')
    },
    getServiceById(db,id){
        return db.select('*').from('flp_services').where({id}).first()
    },
    postService(db,newService){
        return db.insert(newService).into('flp_services').returning('*')
    },
    deleteById(db,id){
        return db("flp_services").where({id}).delete()
    },
    updateById(db,id,newService){
        return db('flp_services').where({id}).update(newService).returning('*')
    }
}

module.exports = ServiceService