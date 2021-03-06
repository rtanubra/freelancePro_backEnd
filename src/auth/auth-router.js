const express = require('express')
const AuthService = require('./auth-service')

const authRouter = express.Router()
const jsonBodyParser = express.json()
const xss = require('xss')

const atob = require('atob')
const bcrypt = require(`bcrypt`)
const saltRounds = 10

authRouter
    .route(`/`)
    .post(jsonBodyParser,(req,res,next)=>{
        const {email, password} = req.body
        if(!email||!password){
            return res.status(400).json({error:`Email and password are both required`})
        }
        const email_decrypt = atob(email)
        const password_decrypt = atob(password)
        
        const db = req.app.get('db')
        AuthService.getUserByEmail(db,email_decrypt).then(user=>{
            if (!user){
                return res.status(400).json({error:`Email and password combination incorrect`})
            }
            if (AuthService.comparePasswords(password_decrypt,user.password)){
                    const subject = user.email
                    const payload = {user_id:user.id,email:user.email}
                    const JsonWebToken=AuthService.createJwt(subject, payload)
                    return res.status(200).json({authToken:JsonWebToken,payload:payload})
            } else {
                return res.status(400).json({error:`Email and password combination incorrect`})
            }
        })
        
    })

authRouter
    .route(`/tokenCheck`)
    .post(jsonBodyParser,(req,res,next)=>{
        const value = AuthService.verifyJwt(req.body.token)
        if (value){
            //pass
            return res.status(200).json({success:true})
        }else {
            //fail 
            return res.status(400).json({error:'Could not authenticate token'})
        }
    })

module.exports = authRouter