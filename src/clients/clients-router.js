const express = require('express')
const ClientsService = require('./clients-service')

const clientsRouter = express.Router()
const jsonBodyParser = express.json()
const xss = require('xss')

clientsRouter
    .route('/')
    .get((req,res,next)=>{
        const db = req.app.get('db')
        ClientsService.getAllClients(db).then(clients=>{
            return res.status(200).json(clients)
        })
    })

module.exports = clientsRouter