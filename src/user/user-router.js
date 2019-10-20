const express = require('express')
const UserService =  require('./user-service')

const userRouter = express.Router()
const jsonBodyParser = express.json()
const xss = require('xss')

userRouter
    .route('/')
    .get((req,res,next)=>{
        const db = req.app.get('db')
        UserService.getAllUser(db).then(users=>{
            return res.status(200).json(users)
        })

    })


module.exports =userRouter