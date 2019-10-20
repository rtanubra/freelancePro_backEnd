const bcrypt = require('bcrypt')

const ServiceService = {
    getAllServices(db){
        return db.select('*').from('flp_services').orderBy('id')
    }
}

module.exports = ServiceService