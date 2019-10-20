const bcrypt = require('bcrypt')

const PromosService ={
    getAllPromos(db){
        return db.select('*').from('flp_promos').orderBy('id')
    }
}

module.exports = PromosService