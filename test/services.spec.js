const app = require('../src/app')
const knex = require('knex')
require('dotenv').config()
const fixture = require('../fixtures/fixtures')
const {makeAuthHeader} = require(`../fixtures/helper`)

describe('clients', ()=>{
    let db 
    before('make knex instance',()=>{
        db = knex({
            client:'pg',
            connection:process.env.TEST_DB_URL
        })
        app.set('db',db)
    })

    before('truncate table to start clean',()=>{
        return db.raw('truncate flp_promos, flp_services, flp_clients restart identity cascade')
    })
    describe(`GET - /api/services`,()=>{
        beforeEach('clean data',()=>{
            return db.raw('truncate flp_promos, flp_services, flp_clients,flp_user restart identity cascade')
        })
        beforeEach('setup user as foreign key',()=>{
            return db.into('flp_user').insert(fixture.user)
        })
        beforeEach('setup promos as foreign key',()=>{
            return db.into('flp_promos').insert(fixture.promos)
        })
        beforeEach('place clients needed as foreign key',()=>{
            return db.into('flp_clients').insert(fixture.clients)
        })
        context(`GET -without good authorization header`,()=>{
            it(`Returns 401 Missing bearer token when auth not provided`,()=>{
                return supertest(app)
                    .get('/api/services')
                    .expect(401).expect({error:'Missing bearer token'})
            })
            it(`Returns 401 Unauthorized access when the wrong header is presented`,()=>{
                return supertest(app)
                    .get(`/api/services`)
                    .set('Authorization', 'bearer thisisWrong')
                    .expect(401).expect({error:'Unauthorized request'})
            })
        })
        context(`With data present`,()=>{
            beforeEach('add data',()=>{
                return db.into('flp_services').insert(fixture.services)
            })
            afterEach('clean data',()=>{
                return db.raw('truncate flp_services restart identity cascade')
            })
            it(`Returns 200 and full list of services`,()=>{
                return supertest(app)
                    .get(`/api/services/`)
                    .set('Authorization', makeAuthHeader(fixture.userNoCreds))
                    .expect(200)
                    .expect(fixture.services_answer)
            })
        })
        context(`Without data present`,()=>{
            it(`Return 200 with no data, because no data has been inputed`,()=>{
                return supertest(app)
                    .get(`/api/services/`)
                    .set('Authorization', makeAuthHeader(fixture.userNoCreds))
                    .expect(200)
                    .expect([])
            })

        })
    })

    describe(`POST - /api/services`,()=>{
        beforeEach('clean data',()=>{
            return db.raw('truncate flp_promos, flp_services, flp_clients,flp_user restart identity cascade')
        })
        beforeEach('setup user as foreign key',()=>{
            return db.into('flp_user').insert(fixture.user)
        })
        beforeEach('setup promos as foreign key',()=>{
            return db.into('flp_promos').insert(fixture.promos)
        })
        beforeEach('place clients needed as foreign key',()=>{
            return db.into('flp_clients').insert(fixture.clients)
        })
        context(`POST -without good authorization header`,()=>{
            it(`Returns 401 Missing bearer token when auth not provided`,()=>{
                return supertest(app)
                    .post('/api/services')
                    .expect(401).expect({error:'Missing bearer token'})
            })
            it(`Returns 401 Unauthorized access when the wrong header is presented`,()=>{
                return supertest(app)
                    .post(`/api/services`)
                    .set('Authorization', 'bearer thisisWrong')
                    .expect(401).expect({error:'Unauthorized request'})
            })
        })
        context(`Good data is presented to post`,()=>{
            afterEach('clean data',()=>{
                return db.raw('truncate flp_services restart identity cascade')
            })
            it(`Returns 200 when goodData is provided`,()=>{
                const newService = fixture.services[0]
                return supertest(app)
                    .post(`/api/services`)
                    .set('Authorization', makeAuthHeader(fixture.userNoCreds))
                    .send(newService)
                    .expect(200)
                    .expect(fixture.services_answer[0])
                    .then(res=>{
                        //check data persists
                        return supertest(app)
                            .get(`/api/services/`)
                            .set('Authorization', makeAuthHeader(fixture.userNoCreds))
                            .expect(200)
                            .expect([fixture.services_answer[0]])
                    })
            })
        })
        
        context(`Incomplete/incorrect data is provided`,()=>{
            afterEach('clean data',()=>{
                return db.raw('truncate flp_services restart identity cascade')
            })
            it(`Returns 400 when cost is not provided`,()=>{
                const newService = {...fixture.services[0]}
                newService.cost =null
                return supertest(app)
                    .post(`/api/services/`)
                    .set('Authorization', makeAuthHeader(fixture.userNoCreds))
                    .send(newService)
                    .expect(400)
                    .expect({error:`Missing required field - cost`})
            })
            it(`Returns 400 when people is not provided`,()=>{
                const newService = {...fixture.services[0]}
                newService.people =null
                return supertest(app)
                    .post(`/api/services/`)
                    .set('Authorization', makeAuthHeader(fixture.userNoCreds))
                    .send(newService)
                    .expect(400)
                    .expect({error:`Missing required field - people`})
            })

            it(`Returns 400 when notes is not provided`,()=>{
                const newService = {...fixture.services[0]}
                newService.notes =null
                return supertest(app)
                    .post(`/api/services/`)
                    .set('Authorization', makeAuthHeader(fixture.userNoCreds))
                    .send(newService)
                    .expect(400)
                    .expect({error:`Missing required field - notes`})
            })
            
            it(`Returns 400 when client_id provided does not exist`,()=>{
                const newService = {...fixture.services[0]}
                newService.client_id=50
                return supertest(app)
                    .post(`/api/services/`)
                    .set('Authorization', makeAuthHeader(fixture.userNoCreds))
                    .send(newService)
                    .expect(400)
                    .expect({error:`No client with id ${newService.client_id}`})
            })

            it(`Returns 400 when promo_id provided does not exist`,()=>{
                const newService = {...fixture.services[0]}
                newService.promo_id=50
                return supertest(app)
                    .post(`/api/services/`)
                    .set('Authorization', makeAuthHeader(fixture.userNoCreds))
                    .send(newService)
                    .expect(400)
                    .expect({error:`Client does not have that open promo id - ${newService.promo_id}`})
            })
        })

        
        
    })

    describe(`GET - /api/services/:serviceId`,()=>{
        beforeEach('clean data',()=>{
            return db.raw('truncate flp_promos, flp_services, flp_clients,flp_user restart identity cascade')
        })
        beforeEach('setup user as foreign key',()=>{
            return db.into('flp_user').insert(fixture.user)
        })
        beforeEach('setup promos as foreign key',()=>{
            return db.into('flp_promos').insert(fixture.promos)
        })
        beforeEach('place clients needed as foreign key',()=>{
            return db.into('flp_clients').insert(fixture.clients)
        })
        context(`GET /:Id -without good authorization header`,()=>{
            beforeEach('add data',()=>{
                return db.into('flp_services').insert(fixture.services)
            })
            afterEach('clean data',()=>{
                return db.raw('truncate flp_services restart identity cascade')
            })
            it(`Returns 401 Missing bearer token when auth not provided`,()=>{
                return supertest(app)
                    .get('/api/services/1')
                    .expect(401).expect({error:'Missing bearer token'})
            })
            it(`Returns 401 Unauthorized access when the wrong header is presented`,()=>{
                return supertest(app)
                    .get(`/api/services/1`)
                    .set('Authorization', 'bearer thisisWrong')
                    .expect(401).expect({error:'Unauthorized request'})
            })
        })
        context(`Look for existing data`,()=>{
            beforeEach('add data',()=>{
                return db.into('flp_services').insert(fixture.services)
            })
            afterEach('clean data',()=>{
                return db.raw('truncate flp_services restart identity cascade')
            })
            it(`Returns 200 with selected service`,()=>{
                const serviceId = 1
                return supertest(app)
                    .get(`/api/services/${serviceId}/`)
                    .set('Authorization', makeAuthHeader(fixture.userNoCreds))
                    .expect(200)
                    .expect(fixture.services_answer[serviceId-1])
            })
        })
        context(`Look for non existing data`,()=>{
            it(`Returns 404, resource not found when we look for non existing data`,()=>{
                const serviceId = 300
                return supertest(app)
                    .get(`/api/services/${serviceId}/`)
                    .set('Authorization', makeAuthHeader(fixture.userNoCreds))
                    .expect(404)
                    .expect({error:`Could not locate service with id - ${serviceId}`})
            })
        })
    })

    describe(`DELETE - /api/services/:serviceId`,()=>{
        beforeEach('clean data',()=>{
            return db.raw('truncate flp_promos, flp_services, flp_clients,flp_user restart identity cascade')
        })
        beforeEach('setup user as foreign key',()=>{
            return db.into('flp_user').insert(fixture.user)
        })
        beforeEach('setup promos as foreign key',()=>{
            return db.into('flp_promos').insert(fixture.promos)
        })
        beforeEach('place clients needed as foreign key',()=>{
            return db.into('flp_clients').insert(fixture.clients)
        })
        context(`DELETE /:Id -without good authorization header`,()=>{
            beforeEach('add data',()=>{
                return db.into('flp_services').insert(fixture.services)
            })
            afterEach('clean data',()=>{
                return db.raw('truncate flp_services restart identity cascade')
            })
            it(`Returns 401 Missing bearer token when auth not provided`,()=>{
                return supertest(app)
                    .delete('/api/services/1')
                    .expect(401).expect({error:'Missing bearer token'})
            })
            it(`Returns 401 Unauthorized access when the wrong header is presented`,()=>{
                return supertest(app)
                    .delete(`/api/services/1`)
                    .set('Authorization', 'bearer thisisWrong')
                    .expect(401).expect({error:'Unauthorized request'})
            })
        })
        context(`Delete existing data`,()=>{
            beforeEach('add data',()=>{
                return db.into('flp_services').insert(fixture.services)
            })
            afterEach('clean data',()=>{
                return db.raw('truncate flp_services restart identity cascade')
            })
            it(`Returns 204 and deletes data from db when given good serviceId`,()=>{
                const serviceId = 1
                return supertest(app)
                    .delete(`/api/services/${serviceId}`)
                    .set('Authorization', makeAuthHeader(fixture.userNoCreds))
                    .expect(204)
                    .then(res=>{
                        //check data is no longer there
                        return supertest(app)
                            .get(`/api/services/${serviceId}`)
                            .set('Authorization', makeAuthHeader(fixture.userNoCreds))
                            .expect(404)
                    })
            })
            it(`Returns 404 and data does not exist when provided bad serviceId`,()=>{
                const serviceId = 200
                return supertest(app)
                    .delete(`/api/services/${serviceId}`)
                    .set('Authorization', makeAuthHeader(fixture.userNoCreds))
                    .expect(404)
                    .expect({error:`Could not locate service with id - ${serviceId}`})
            })
        })
    })

    describe(`PATCH - /api/services/:serviceId`,()=>{
        beforeEach('clean data',()=>{
            return db.raw('truncate flp_promos, flp_services, flp_clients,flp_user restart identity cascade')
        })
        beforeEach('setup user as foreign key',()=>{
            return db.into('flp_user').insert(fixture.user)
        })
        beforeEach('setup promos as foreign key',()=>{
            return db.into('flp_promos').insert(fixture.promos)
        })
        beforeEach('place clients needed as foreign key',()=>{
            return db.into('flp_clients').insert(fixture.clients)
        })
        context(`PATCH /:Id -without good authorization header`,()=>{
            beforeEach('add data',()=>{
                return db.into('flp_services').insert(fixture.services)
            })
            afterEach('clean data',()=>{
                return db.raw('truncate flp_services restart identity cascade')
            })
            it(`Returns 401 Missing bearer token when auth not provided`,()=>{
                return supertest(app)
                    .patch('/api/services/1')
                    .expect(401).expect({error:'Missing bearer token'})
            })
            it(`Returns 401 Unauthorized access when the wrong header is presented`,()=>{
                return supertest(app)
                    .patch(`/api/services/1`)
                    .set('Authorization', 'bearer thisisWrong')
                    .expect(401).expect({error:'Unauthorized request'})
            })
        })
        context(`PATCH /:Id -without good authorization header`,()=>{
            beforeEach('add data',()=>{
                return db.into('flp_services').insert(fixture.services)
            })
            afterEach('clean data',()=>{
                return db.raw('truncate flp_services restart identity cascade')
            })
            it(`Returns 401 Missing bearer token when auth not provided`,()=>{
                return supertest(app)
                    .patch('/api/services/1')
                    .expect(401).expect({error:'Missing bearer token'})
            })
            it(`Returns 401 Unauthorized access when the wrong header is presented`,()=>{
                return supertest(app)
                    .patch(`/api/services/1`)
                    .set('Authorization', 'bearer thisisWrong')
                    .expect(401).expect({error:'Unauthorized request'})
            })
        })
        context(`Service does not exist`,()=>{
            it(`Returns 400 when service does not exist`,()=>{
                const serviceId = 50
                const updateService = {...fixture.services_answer[0]}
                const newItem = "updated Service"
                updateService.notes=newItem
                return supertest(app)
                    .patch(`/api/services/${serviceId}`)
                    .set('Authorization', makeAuthHeader(fixture.userNoCreds))
                    .send({notes:newItem})
                    .expect(404)
                    .expect({error:`Could not locate service with id - ${serviceId}`})
            })
        })
        context(`Good patches`,()=>{
            beforeEach('add data',()=>{
                return db.into('flp_services').insert(fixture.services[0])
            })
            afterEach('clean data',()=>{
                return db.raw('truncate flp_services restart identity cascade')
            })
            it(`Returns 200 with updated note if changed correctly`,()=>{
                const serviceId = 1
                const updateService = {...fixture.services_answer[0]}
                const newItem = "updated Service"
                updateService.notes=newItem
                return supertest(app)
                    .patch(`/api/services/${serviceId}`)
                    .set('Authorization', makeAuthHeader(fixture.userNoCreds))
                    .send({notes:newItem})
                    .expect(200)
                    .expect(updateService)
                    .then(res=>{
                        return supertest(app)
                            .get(`/api/services/`)
                            .set('Authorization', makeAuthHeader(fixture.userNoCreds))
                            .expect(200)
                            .expect([updateService])
                    })
            })
            it(`Returns 200 with updated cost if changed correctly`,()=>{
                const serviceId = 1
                const updateService = {...fixture.services_answer[0]}
                const newItem = 6000
                updateService.cost=newItem
                return supertest(app)
                    .patch(`/api/services/${serviceId}`)
                    .set('Authorization', makeAuthHeader(fixture.userNoCreds))
                    .send({cost:newItem})
                    .expect(200)
                    .expect(updateService)
                    .then(res=>{
                        return supertest(app)
                            .get(`/api/services/`)
                            .set('Authorization', makeAuthHeader(fixture.userNoCreds))
                            .expect(200)
                            .expect([updateService])
                    })
                    
            })
            it(`Returns 200 with updated people if changed correctly`,()=>{
                const serviceId = 1
                const updateService = {...fixture.services_answer[0]}
                const newItem = 6000
                updateService.people=newItem
                return supertest(app)
                    .patch(`/api/services/${serviceId}`)
                    .set('Authorization', makeAuthHeader(fixture.userNoCreds))
                    .send({people:newItem})
                    .expect(200)
                    .expect(updateService)
                    .then(res=>{
                        return supertest(app)
                            .get(`/api/services/`)
                            .set('Authorization', makeAuthHeader(fixture.userNoCreds))
                            .expect(200)
                            .expect([updateService])
                    })
            })  
        })
    })
    after('disconnect from db',()=>{
        return db.destroy()
    })
})