const express = require('express')
const ClientsService = require('./clients-service')

const clientsRouter = express.Router()
const jsonBodyParser = express.json()
const xss = require('xss')

const ValidateHelper = require('../helpers/validation')

const UserService = require('../user/user-service')

clientsRouter
    .route('/')
    .get((req,res,next)=>{
        const db = req.app.get('db')
        ClientsService.getAllClients(db).then(clients=>{
            return res.status(200).json(clients)
        })
    })
    .post(jsonBodyParser,(req,res,next)=>{
        const db = req.app.get('db')
        const {name, email, phone, user_id,open_promo} = req.body
        
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
        if(!valid[0]){
            return res.status(400).json({error:`Client phone: ${valid[1]}`})
        }
        
        //make sure user exists
        if (!user_id){
            return res.status(400).json({error:`User_id is required`})
        }

        //Should we use a promo.
        const client = {name, email, phone, user_id}
        if (open_promo){
            client.open_promo = req.body.open_promo
        }

        ClientsService.getAllClients(db).then(clients=>{
            const sameEmail = clients.find(client=>{
                return client.email === email
            })
            const samePhone = clients.find(client=>{
                return client.phone === phone
            })
            if (sameEmail){
                return res.status(400).json({error:`A client with email - ${email} - already exists`})
            }

            if (samePhone){
                return res.status(400).json({error:`A client with phone - ${phone} -  already exits`})
            }

            ClientsService.postClient(db,client).then(client=>{
                return res.status(400).json(client)
            })
        })


    })

module.exports = clientsRouter