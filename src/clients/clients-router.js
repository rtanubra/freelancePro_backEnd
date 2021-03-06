const express = require('express')
const ClientsService = require('./clients-service')

const clientsRouter = express.Router()
const jsonBodyParser = express.json()
const xss = require('xss')

const ValidateHelper = require('../helpers/validation')
const {phoneCreate} = require('../helpers/phone')
const UserService = require('../user/user-service')

//protected endpoints 
const {requireAuth} = require(`../middleware/jwt-auth`)

clientsRouter
    .route('/')
    .all(requireAuth)
    .get((req,res,next)=>{
        const db = req.app.get('db')
        let {user_id} = req.headers 
        if (!user_id){
            user_id = 1
        }
        return ClientsService.getUserClients(db,user_id).then(clients=>{
            return res.status(200).json(clients)
        })
    })
    .post(jsonBodyParser,(req,res,next)=>{
        const db = req.app.get('db')
        let {name, email, phone, user_id,open_promo,more_notes,adress} = req.body
        email = email.toLowerCase()
        if (!name){
            return res.status(400).json({error:"Name is required"})
        }
        let valid = ValidateHelper.nameCheck(name)
        if (!valid[0]){     
            return res.status(400).json({error:`Client name: ${valid[1]}`})
        }

        if (!email){
            return res.status(400).json({error:"Email is required"})
        }
        valid = ValidateHelper.emailChek(email)
        if(!valid[0]){
            return res.status(400).json({error:`Client email: ${valid[1]}`})
        }

        if (!phone){
            return res.status(400).json({error:"Phone is required"})
        }
        
        valid = ValidateHelper.phoneCheck(phone)
        phone = phoneCreate(phone)
        if(!valid[0]){
            return res.status(400).json({error:`Client phone: ${valid[1]}`})
        }
        
        //make sure user exists
        if (!user_id){
            return res.status(400).json({error:`User_id is required`})
        }

        //Should we use a promo.
        const client = {name, email, phone, user_id}
        
        if (more_notes){
            client.more_notes = more_notes
        }
        if (adress) { 
            client.adress =adress
        }
        if (open_promo){
            client.open_promo = req.body.open_promo
        }

        return ClientsService.getAllClients(db).then(clients=>{
            const sameEmail = clients.find(client=>{
                return client.email === email
            })
            const samePhone = clients.find(client=>{
                return client.phone === phoneCreate(phone)
            })
            if (sameEmail){
                return res.status(400).json({error:`A client with email - ${email} - already exists`})
            }

            if (samePhone){
                return res.status(400).json({error:`A client with phone - ${phone} -  already exits`})
            }

            return ClientsService.postClient(db,client).then(client=>{
                return res.status(200).json(client[0])
            })
        })


    })

    clientsRouter
        .route('/:clientId')
        .all(requireAuth)
        .all(jsonBodyParser,(req,res,next)=>{
            const db= req.app.get('db')
            const id = req.params.clientId
            return ClientsService.getClientById(db,id).then(client=>{
                if (!client){
                    return res.status(404).json({error:`Client with Id ${id} does not exist.`})
                }
                else {
                    res.client = client
                    return next()
                }
            })
        })
        .get((req,res,next)=>{
            return res.status(200).json(res.client)
        })
        .delete((req,res,next)=>{
            const db = req.app.get('db')
            const id= res.client.id
            return ClientsService.deleteById(db,id).then(()=>{
                return res.status(204).end()
            })
        })
        .patch((req,res,next)=>{
            const db = req.app.get('db')
            const id = res.client.id
            const {name, email, phone, user_id,open_promo, more_notes,adress} = req.body
            const newClient ={name, email, phone, user_id,open_promo, more_notes,adress}
            return ClientsService.getAllClients(db).then(clients=>{
                let valid
                let dupeCheck
                if (name){
                    valid = ValidateHelper.nameCheck(name)
                    if (!valid[0]){
                        return res.status(400).json({error: `Client name - ${valid[1]}`})
                    }
                }

                if (email){
                    valid = ValidateHelper.emailChek(email)
                        if (!valid[0]){
                            return res.status(400).json({error:`Client email - ${valid[1]}`})
                        }
                    
                    dupeCheck = clients.filter(client=>{
                        return client.email === email
                    })
                    if (dupeCheck.length >0){
                        if(dupeCheck.length ===1){
                            if (dupeCheck[0].id != id){
                                return res.status(400).json({error:`A client with email - ${email} - already exists`})
                            }
                        } 
                    }
                }
                if (phone){
                    valid = ValidateHelper.phoneCheck(phone)
                    if (!valid[0]){
                        return res.status(400).json({error: `Client phone - ${valid[1]}`})
                    }
                    dupeCheck = clients.filter(client=>{
                        return client.phone === phone
                    })
                    if (dupeCheck.length >0){
                        if(dupeCheck.length ===1){
                            if (dupeCheck[0].id != id){
                                return res.status(400).json({error:`A client with phone - ${phone} - already exists`})
                            }
                        } 
                    }
                }
                return ClientsService.updateById(db,id,newClient).then(client=>{
                    return res.status(200).json(client[0])
                })
            })
            
            
        })

module.exports = clientsRouter