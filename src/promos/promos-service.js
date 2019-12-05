const bcrypt = require('bcrypt')

const PromosService ={
    getAllPromos(db){
        return db.select('*').from('flp_promos').orderBy('id')
    },
    getUserPromos(db,user_id){
        return db.select('*').from('flp_promos').where({user_id}).orderBy('id','desc')
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
    },
    rawString(clients,promoId){
        let clientStream = ""
        clients.forEach(client=>{
            clientStream= clientStream + `'${client}',`
        })
        return `Update flp_clients SET open_promo = ${promoId}  WHERE id IN (${clientStream.substring(0,clientStream.length-1)})`
    },
    updateMass(db,myStr){
        return db.raw(myStr)
    }

}

module.exports = PromosService