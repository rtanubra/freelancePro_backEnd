require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')


const app = express()

//all my routers
const promosRouter = require('./promos/promos-router')
const clientsRouter = require('./clients/clients-router')
const serviceRouter = require('./services/services-router')
const userRouter = require('./user/user-router')


const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common';

app.use(morgan(morganOption))
app.use(cors())
app.use(helmet())

app.get('/',(req,res)=>{
    res.send("Hello, world!")
})

app.use('/api/promos',promosRouter)
app.use('/api/clients',clientsRouter)
app.use('/api/services',serviceRouter)
app.use('/api/user',userRouter)



function errorHandler(error, req,res,next){
    let response
    if (NODE_ENV === 'production'){
        response = {error:{message:"server error"}}
    } else {
        console.log(error)
        response = { message: error.message, error}
    }
    res.status(500).json(response)
}
app.use(errorHandler)

module.exports = app