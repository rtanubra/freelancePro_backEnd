const express = require('express')
const PromosService = require('./promos-service')

const promosRouter = express.Router()
const jsonBodyParser = express.json()
const xss = require('xss')

promosRouter
    .route('/')
    .get((req,res,next)=>{
        const db = req.app.get('db')
        PromosService.getAllPromos(db).then((promos)=>{
            return res.status(200).json(promos)
        })
    })


module.exports = promosRouter