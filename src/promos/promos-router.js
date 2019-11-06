const express = require('express')
const PromosService = require('./promos-service')

const promosRouter = express.Router()
const jsonBodyParser = express.json()
const xss = require('xss')

const {requireAuth} = require(`../middleware/jwt-auth`)

promosRouter
    .route('/')
    .all(requireAuth)
    .get((req,res,next)=>{
        const db = req.app.get('db')
        PromosService.getAllPromos(db).then((promos)=>{
            return res.status(200).json(promos)
        })
    })
    .patch(jsonBodyParser,(req,res,next)=>{
        const db = req.app.get('db')
        const {clients, promo_id} = req.body
        const newUpdate = {clients,promo_id}
        const required = ["clients","promo_id"]
        for (i in required){
            if(!newUpdate[required[i]]){
                return res.status(400).json({error:`Missing required field - ${required[i]}`})
            }
        } 
        const myStr =PromosService.rawString(clients,promo_id)
        PromosService.updateMass(db,myStr).then(()=>{
            return res.status(204).end()
        })
  
    })
    .post(jsonBodyParser,(req,res,next)=>{
        const db = req.app.get('db')
        const {name, description, date_created, date_ending} = req.body
        const newPromo = {name, description, date_created, date_ending}
        //only name and description are required.
       const required = ['name','description']
            for (i in required){
                if(!newPromo[required[i]]){
                    return res.status(400).json({error:`Missing required field - ${required[i]}`})
                }
            }
        return PromosService.getAllPromos(db).then(promos=>{
            const duplicateCheck = promos.find(promo=>{
                return promo.name === name
            })
            if(duplicateCheck){
                return res.status(400).json({error:`A promo with name ${name} already exists`})
            }
            return PromosService.postPromo(db,newPromo).then(promo=>{
                return res.status(200).json(promo[0])
            })
        })

    })

promosRouter
    .route('/:promoId')
    .all(requireAuth)
    .all(jsonBodyParser,(req,res,next)=>{
        const db = req.app.get('db')
        const id = req.params.promoId
        console.log(id)
        return PromosService.getById(db,id).then(promo=>{
            if (!promo){
                return res.status(404).json({error:`Could not locate promo with id - ${id}`})
            } else {
                res.promo = promo
                return next()
            }
        })
    })
    .get((req,res,next)=>{
        return res.status(200).json(res.promo)
    })
    .delete((req,res,next)=>{
        const db = req.app.get('db')
        return PromosService.deleteById(db,res.promo.id).then(()=>{
            return res.status(204).end()
        })
    })
    .patch((req,res,next)=>{
        const db = req.app.get('db')
        const id = res.promo.id 
        const {name, description, date_created, date_ending} = req.body
        const updatePromo = {name, description, date_created, date_ending}

        return PromosService.getAllPromos(db).then(promos=>{
            //if name is changed validate that it doesnt already exist
            if (name){
                if (name !== res.promo.name){
                    const duplicateCheck = promos.find(promo=>{
                        return promo.name.toLowerCase() === name.toLowerCase()
                    })
                    if (duplicateCheck){
                        return res.status(400).json({error:`A promo with name ${name} already exists`})
                    }
                }
            }
            return PromosService.updatePromo(db,id,updatePromo).then(promo=>{
                return res.status(200).json(promo[0])
            })
            
        })
    })


module.exports = promosRouter