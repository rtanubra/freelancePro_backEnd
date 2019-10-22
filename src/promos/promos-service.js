const bcrypt = require('bcrypt')

const PromosService ={
    getAllPromos(db){
        return db.select('*').from('flp_promos').orderBy('id')
    },
    getById(db,id){
        return db.select('*').from('flp_promos').where({id}).first()
    },
    postPromo(db,newPromo){
        return db.insert(newPromo).into('flp_promos').returning('*')
    },
    deleteById(db,id){
        return db('flp_promos').where({id}).delete()
    },
    updatePromo(db,id,updatePromo){
        return db('flp_promos').where({id}).update(updatePromo).returning('*')
    }

}

module.exports = PromosService