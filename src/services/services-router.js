const express = require('express')
const ServiceService = require('./services-service')
const ClientService = require('../clients/clients-service')

const serviceRouter = express.Router()
const jsonBodyParser = express.json()
const xss = require('xss')

const {requireAuth} = require(`../middleware/jwt-auth`)

serviceRouter
    .route('/')
    .all(requireAuth)
    .get((req,res,next)=>{
        const db = req.app.get('db')
        let {user_id}= req.headers
        if (!user_id){
            user_id = 1
        }
        console.log(user_id)
        return ServiceService.getUserServices(db,user_id).then(services=>{
            return res.status(200).json(services)
        })
    })
    .post(jsonBodyParser,(req,res,next)=>{
        const db = req.app.get('db')
        const {notes,cost,people,promo_id,client_id,user_id,more_notes} = req.body
        const newService = {notes,cost,people,promo_id,client_id,user_id,more_notes}
        
        if (req.body.service_date){
            newService.service_date = req.body.service_date
        }

        return ClientService.getAllClients(db).then(clients=>{
            //validate everything is there
            const required = ['notes','cost','people','client_id','user_id']
            for (i in required){
                if(!newService[required[i]]){
                    return res.status(400).json({error:`Missing required field - ${required[i]}`})
                }
            }

            //have to check that client exists
            const client = clients.find(client=>{
                return client.id === newService["client_id"]
            })
            if(!client){
                return res.status(400).json({error:`No client with id ${client_id}`})
            }
            //have to check that the client has that promo.
            if (newService.promo_id){
                if (newService.promo_id !=client.open_promo){
                    return res.status(400).json({error:`Client does not have that open promo id - ${newService.promo_id}`})
                }
            }
            return ServiceService.postService(db,newService).then(service=>{
                return res.status(200).json(service[0])
            })
        })
        
    })

serviceRouter
    .route('/:serviceId')
    .all(requireAuth)
    .all(jsonBodyParser,(req,res,next)=>{
        const db= req.app.get('db')
        const id = req.params.serviceId
        return ServiceService.getServiceById(db,id).then(service=>{
            if (!service){
                return res.status(404).json({error:`Could not locate service with id - ${id}`})
            } else {
                res.service = service
                return next()
            }
        })
    })
    .get((req,res,next)=>{
        return res.status(200).json(res.service)
    })
    .delete((req,res,next)=>{
        const db=req.app.get('db')
        const id  = res.service.id
        return ServiceService.deleteById(db,id).then(()=>{
            return res.status(204).end()
        })
    })
    .patch((req,res,next)=>{
        const db = req.app.get('db')
        const id = res.service.id
        const {notes,cost,people,promo_id,client_id,service_date,more_notes} = req.body
        const optional = ['notes','cost','people','client_id','more_notes']
        //need to validate client exists.
        return ClientService.getAllClients(db).then(clients=>{
            if (client_id){
                const client = clients.find(cl=>{
                        return cl.id === client_id
                })
                if (!client){
                    return res.status(404).json({error:`Could not locate client with ID - ${client_id}`})
                }
            }
            return ServiceService.updateById(db,id,{notes,cost,people,promo_id,client_id,service_date,more_notes}).then(service=>{
                return res.status(200).json(service[0])
            })
            
        })
   
        //need to validate promo if provided still fits.
    })

module.exports = serviceRouter