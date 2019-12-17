const express = require('express')
const EmailsService = require('./emails-service')

const emailsRouter = express.Router()
const jsonBodyParser = express.json()


const ValidateHelper = require('../helpers/validation')

const nodemailer = require('nodemailer')

//protected endpoints 
const {requireAuth} = require(`../middleware/jwt-auth`)

//
const { EMAIL_PASS, EMAIL_USER } = require('../config')

//prepping my transporter

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use TLS
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false
  }
});


emailsRouter
    .route('/')
    .get((req,res,next)=>{
        return res.status(200).json({hello:"Hello"})
    })
    .post(jsonBodyParser,(req,res,next)=>{
        const required = ["emails","names","promo_name","promo_description"]
        //return res.status(200).json({user:EMAIL_USER,pass:EMAIL_PASS})
        
        for (x in required){
            if(!req.body[required[x]]){
                return res.status(400).json({error:`Missing required field -${required[x]}`})
            }
        }
        let output=""
        
        for (x in req.body.emails){
            output = `
                    <h1>Finese is Giving you a gift</h1>
                    <h2>${req.body.promo_name}</h2>
                    <p>${req.body.promo_description}</p>
                    ${req.body.special_message?req.body.special_message:""}
                    <br></br>
                    <p>The Beauty team at Finesse</p>
                    `
        
            let mailOptions= {
                from:'"Rey Tanubrata" <reyt.apps@gmail.com>',
                to:req.body.emails[x],
                subject:`Gift for ${req.body.names[x]} from Rey`,
                text:"",
                html:output
            }
        
            transporter.sendMail(mailOptions,(error,info)=>{
                if(error){
                    return console.log(error)
                } else {
                    return res.status(200).json({completed:"email has been sent"})
                }
            })

        }
        
    })

emailsRouter
    .route('/custom')
    .post(jsonBodyParser,(req,res,next)=>{
        const {subject, toEmail, body} = req.body
        const {names} = req.body
        const required = ['subject', 'toEmail', 'body']
        if (names){
            if(names.length !=toEmail.lengths){
                return res.status(400).json({error:`When names are provided the number of names must include the number of emails sent`})
            }
        }
        for (x in required){
            if(!req.body[required[x]]){
                return res.status(400).json({error:`Missing required field -${required[x]}`})
            }
        }
        
        let output 
        for (x in toEmail){
            output = `
                    ${body}
                    `
        
            let mailOptions= {
                from:'"Rey Tanubrata" <reyt.apps@gmail.com>',
                to:toEmail[x],
                subject:subject,
                text:"",
                html:output
            }
            transporter.sendMail(mailOptions,(error,info)=>{
                if(error){
                    return console.log(error)
                } else {
                    return res.status(200).json({completed:"email has been sent"})
                }
            })
    }

        return res.status(202).end()
    })

module.exports = emailsRouter