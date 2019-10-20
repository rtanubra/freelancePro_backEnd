const express = require('express')
const ServiceService = require('./services-service')

const serviceRouter = express.Router()
const jsonBodyParser = express.json()
const xss = require('xss')

serviceRouter
    .route('/')
    .get((req,res,next)=>{
        const db = req.app.get('db')
        ServiceService.getAllServices(db).then(services=>{
            return res.status(200).json(services)
        })
    })

module.exports = serviceRouter