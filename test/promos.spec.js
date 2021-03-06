const app = require('../src/app')
const knex = require('knex')
require('dotenv').config()
const fixture = require('../fixtures/fixtures')
const {makeAuthHeader} = require(`../fixtures/helper`)

describe(`Promos`,()=>{
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
    
    describe(`GET - /api/promos`,()=>{
        beforeEach('clean data',()=>{
            return db.raw('truncate flp_promos, flp_services, flp_clients,flp_user restart identity cascade')
        })
        beforeEach('setup user as foreign key',()=>{
            return db.into('flp_user').insert(fixture.user)
        })
        context(`GET not good auth headers`,()=>{
            it(`Returns 401 with missing bearer token when not provided`,()=>{
                return supertest(app)
                    .get(`/api/promos`)
                    .expect(401)
                    .expect({error:`Missing bearer token`})
            })
            it(`Returns 401 with unauthorized access when provided incorrect token`,()=>{
                return supertest(app)
                    .get(`/api/promos`)
                    .set('Authorization',`bearer thisIsAVeryLargeBear` )
                    .expect(401)
                    .expect({error:`Unauthorized request`})
            })
        })
        context(`With data present`,()=>{
            beforeEach('add data',()=>{
                return db.into('flp_promos').insert(fixture.promos)
            })
            afterEach('clean data',()=>{
                return db.raw('truncate flp_promos restart identity cascade')
            })
            it(`Returns 200 with all promos`,()=>{
                return supertest(app)
                    .get(`/api/promos`)
                    .set('Authorization', makeAuthHeader(fixture.userNoCreds))
                    .expect(200)
                    .expect(fixture.promos_answer)
            })
            
        })
        context(`Without data present`,()=>{
            afterEach('clean data',()=>{
                return db.raw('truncate flp_promos restart identity cascade')
            })
            it(`Returns 200 with [] when no data present`,()=>{
                return supertest(app)
                    .get(`/api/promos/`)
                    .set('Authorization', makeAuthHeader(fixture.userNoCreds))
                    .expect(200)
                    .expect([])
            })
        })
    })

    describe(`POST - /api/promos`,()=>{
        beforeEach('clean data',()=>{
            return db.raw('truncate flp_promos, flp_services, flp_clients,flp_user restart identity cascade')
        })
        beforeEach('setup user as foreign key',()=>{
            return db.into('flp_user').insert(fixture.user)
        })
        context(`POST not good auth headers`,()=>{
            it(`Returns 401 with missing bearer token when not provided`,()=>{
                return supertest(app)
                    .post(`/api/promos`)
                    .expect(401)
                    .expect({error:`Missing bearer token`})
            })
            it(`Returns 401 with unauthorized access when provided incorrect token`,()=>{
                return supertest(app)
                    .post(`/api/promos`)
                    .set('Authorization',`bearer thisIsAVeryLargeBear` )
                    .expect(401)
                    .expect({error:`Unauthorized request`})
            })
        })
        context(`Correctly adding data`,()=>{
            afterEach('clean data',()=>{
                return db.raw('truncate flp_promos restart identity cascade')
            })
            it(`Returns 200 with added data when provided correct info (data persists)`,()=>{
                return supertest(app)
                    .post(`/api/promos/`)
                    .set('Authorization', makeAuthHeader(fixture.userNoCreds))
                    .send(fixture.promos[0])
                    .expect(200)
                    .expect(fixture.promos_answer[0])
                    .then(res=>{
                        //after validating return, check data persists
                        return supertest(app)
                            .get(`/api/promos`)
                            .set('Authorization', makeAuthHeader(fixture.userNoCreds))
                            .expect(200)
                            .expect([fixture.promos_answer[0]])
                    })
            })
        })
        context(`Incomplete data provided`,()=>{
            afterEach('clean data',()=>{
                return db.raw('truncate flp_promos restart identity cascade')
            })
            const required = ["name","description"]
            for (i in required){
                it(`Returns 400 with prompt to add ${required[i]} when not provided`,()=>{
                    const promoToAdd = {...fixture.promos[0]}
                    promoToAdd[required[i]] = null
                    return supertest(app)
                        .post(`/api/promos/`)
                        .set('Authorization', makeAuthHeader(fixture.userNoCreds))
                        .send(promoToAdd)
                        .expect(400)
                        .expect({error:`Missing required field - ${required[i]}`})
                })
                
            }
                
            
        })
    })

    describe(`GET - /api/promos/:promoId`,()=>{
        beforeEach('clean data',()=>{
            return db.raw('truncate flp_promos, flp_services, flp_clients,flp_user restart identity cascade')
        })
        beforeEach('setup user as foreign key',()=>{
            return db.into('flp_user').insert(fixture.user)
        })
        context(`GET :id not good auth headers`,()=>{
            beforeEach('add data',()=>{
                return db.into('flp_promos').insert(fixture.promos)
            })
            afterEach('clean data',()=>{
                return db.raw('truncate flp_promos restart identity cascade')
            })
            it(`Returns 401 with missing bearer token when not provided`,()=>{
                return supertest(app)
                    .get(`/api/promos/1`)
                    .expect(401)
                    .expect({error:`Missing bearer token`})
            })
            it(`Returns 401 with unauthorized access when provided incorrect token`,()=>{
                return supertest(app)
                    .get(`/api/promos/1`)
                    .set('Authorization',`bearer thisIsAVeryLargeBear` )
                    .expect(401)
                    .expect({error:`Unauthorized request`})
            })
        })
        context(`Get a promo that exists`,()=>{
            beforeEach('add data',()=>{
                return db.into('flp_promos').insert(fixture.promos)
            })
            afterEach('clean data',()=>{
                return db.raw('truncate flp_promos restart identity cascade')
            })
            it(`Returns 200 with the selected promo when it exists`,()=>{
                const promoId = 1
                return supertest(app)
                    .get(`/api/promos/${promoId}`)
                    .set('Authorization', makeAuthHeader(fixture.userNoCreds))
                    .expect(200)
                    .expect(fixture.promos_answer[promoId-1])
            })
        })
        context(`Get a promo that doesn't exist`,()=>{
            afterEach('clean data',()=>{
                return db.raw('truncate flp_promos restart identity cascade')
            })
            it(`Returns a 404 resource not found when searching for a promo that does not exist`,()=>{
                const promoId = 1
                return supertest(app)
                    .get(`/api/promos/${promoId}`)
                    .set('Authorization', makeAuthHeader(fixture.userNoCreds))
                    .expect(404)
                    .expect({error:`Could not locate promo with id - ${promoId}`})
            })
        })

    })

    describe(`DELETE - /api/promos/:promoId`,()=>{
        beforeEach('clean data',()=>{
            return db.raw('truncate flp_promos, flp_services, flp_clients,flp_user restart identity cascade')
        })
        beforeEach('setup user as foreign key',()=>{
            return db.into('flp_user').insert(fixture.user)
        })
        context(`DELETE :id not good auth headers`,()=>{
            beforeEach('add data',()=>{
                return db.into('flp_promos').insert(fixture.promos)
            })
            afterEach('clean data',()=>{
                return db.raw('truncate flp_promos restart identity cascade')
            })
            it(`Returns 401 with missing bearer token when not provided`,()=>{
                return supertest(app)
                    .delete(`/api/promos/1`)
                    .expect(401)
                    .expect({error:`Missing bearer token`})
            })
            it(`Returns 401 with unauthorized access when provided incorrect token`,()=>{
                return supertest(app)
                    .delete(`/api/promos/1`)
                    .set('Authorization',`bearer thisIsAVeryLargeBear` )
                    .expect(401)
                    .expect({error:`Unauthorized request`})
            })
        })
        context(`When looking for existing promo`,()=>{
            beforeEach(`Add data`,()=>{
                return db.into(`flp_promos`).insert(fixture.promos)
            })
            afterEach('clean data',()=>{
                return db.raw('truncate flp_promos restart identity cascade')
            })
            it(`Returns 204 with succesful data and when searched data will no longer exist`,()=>{
                const promoId = 1
                return supertest(app)
                    .delete(`/api/promos/${promoId}`)
                    .set('Authorization', makeAuthHeader(fixture.userNoCreds))
                    .expect(204)
                    .then(res=>{
                        return supertest(app)
                            .get(`/api/promos/${promoId}`)
                            .set('Authorization', makeAuthHeader(fixture.userNoCreds))
                            .expect(404)
                            .expect({error:`Could not locate promo with id - ${promoId}`})
                    })
            })

        })
        context(`When looking for non existing promo`,()=>{
            beforeEach('add data',()=>{
                return db.into('flp_promos').insert(fixture.promos)
            })
            afterEach('clean data',()=>{
                return db.raw('truncate flp_promos restart identity cascade')
            })
            it(`Returns 404 resource not found when attempting to delete non existing data`,()=>{
                const promoId = 500
                return supertest(app)
                    .delete(`/api/promos/${promoId}`)
                    .set('Authorization', makeAuthHeader(fixture.userNoCreds))
                    .expect(404).expect({error:`Could not locate promo with id - ${promoId}`})
            })
        })
    })

    describe(`PATCH - /api/promos/:promoId`,()=>{
        beforeEach('clean data',()=>{
            return db.raw('truncate flp_promos, flp_services, flp_clients,flp_user restart identity cascade')
        })
        beforeEach('setup user as foreign key',()=>{
            return db.into('flp_user').insert(fixture.user)
        })
        context(`PATCH :id not good auth headers`,()=>{
            beforeEach('add data',()=>{
                return db.into('flp_promos').insert(fixture.promos)
            })
            afterEach('clean data',()=>{
                return db.raw('truncate flp_promos restart identity cascade')
            })
            it(`Returns 401 with missing bearer token when not provided`,()=>{
                return supertest(app)
                    .patch(`/api/promos/1`)
                    .expect(401)
                    .expect({error:`Missing bearer token`})
            })
            it(`Returns 401 with unauthorized access when provided incorrect token`,()=>{
                return supertest(app)
                    .patch(`/api/promos/1`)
                    .set('Authorization',`bearer thisIsAVeryLargeBear` )
                    .expect(401)
                    .expect({error:`Unauthorized request`})
            })
        })
        context(`Attempt to patch non existing data`,()=>{
            const badId = 30
            it(`Return 404 with no existing data`,()=>{
                return supertest(app)
                    .patch(`/api/promos/${badId}`)
                    .set('Authorization', makeAuthHeader(fixture.userNoCreds))
                    .expect(404).expect({error:`Could not locate promo with id - ${badId}`})
            })
        })
        context(`Good PATCH`,()=>{
            beforeEach('add data',()=>{
                return db.into('flp_promos').insert(fixture.promos)
            })
            afterEach('clean data',()=>{
                return db.raw('truncate flp_promos restart identity cascade')
            })
            
            it(`Returns 200 with update name`,()=>{
                const promoId = 1
                const newPromo = {...fixture.promos_answer[promoId-1]}
                const updatedFeature = "new Name"
                newPromo.name = updatedFeature
                return supertest(app)
                    .patch(`/api/promos/${promoId}`)
                    .set('Authorization', makeAuthHeader(fixture.userNoCreds))
                    .send({name:updatedFeature})
                    .expect(200)
                    .expect(newPromo)
                    .then(res=>{
                        //expect changes to persist
                        return supertest(app)
                            .get(`/api/promos/${promoId}`)
                            .set('Authorization', makeAuthHeader(fixture.userNoCreds))
                            .expect(200)
                            .expect(newPromo)
                    })
            })
            it(`Returns 200 with updated description`,()=>{
                const promoId = 1
                const newPromo = {...fixture.promos_answer[promoId-1]}
                const updatedFeature = "new description check this out"
                newPromo.description = updatedFeature
                return supertest(app)
                    .patch(`/api/promos/${promoId}`)
                    .set('Authorization', makeAuthHeader(fixture.userNoCreds))
                    .send({description:updatedFeature})
                    .expect(200)
                    .expect(newPromo)
                    .then(res=>{
                        //expect changes to persist
                        return supertest(app)
                            .get(`/api/promos/${promoId}`)
                            .set('Authorization', makeAuthHeader(fixture.userNoCreds))
                            .expect(200)
                            .expect(newPromo)
                    })
            })
        })
    })

    after('disconnect from db',()=>{
        return db.destroy()
    })
})