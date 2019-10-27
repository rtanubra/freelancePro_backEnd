const app = require('../src/app')
const knex = require('knex')
require('dotenv').config()
const fixture = require('../fixtures/fixtures')

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
    

    describe('GET /api/clients/',()=>{
        context('No Starting data',()=>{
            it('returns 200 with no clients',()=>{
                return supertest(app)
                    .get('/api/clients/')
                    .expect(200,[])
            })
        })
        context('With starting data',()=>{
            before('clean data',()=>{
                return db.raw('truncate flp_promos, flp_services, flp_clients,flp_user restart identity cascade')
            })
            before('setup user as foreign key',()=>{
                return db.into('flp_user').insert(fixture.user)
            })
            before('setup promos as foreign key',()=>{
                return db.into('flp_promos').insert(fixture.promos)
            })
            before('place data',()=>{
                return db.into('flp_clients').insert(fixture.clients)
            })
            after('clean data',()=>{
                return db.raw('truncate flp_services, flp_clients restart identity cascade')
            })
            it('returns 200 with clients inserted' , ()=>{
                return supertest(app)
                    .get('/api/clients/')
                    .expect(200)
                    .expect((res)=>{
                        expect(res.body).to.eql(fixture.clients_answer)
                    })
            })
        })
    })

    describe('POST /api/clients/',()=>{
        before('clean data',()=>{
            return db.raw('truncate flp_promos, flp_services, flp_clients,flp_user restart identity cascade')
        })
        before('setup user as foreign key',()=>{
            return db.into('flp_user').insert(fixture.user)
        })
        before('setup promos as foreign key',()=>{
            return db.into('flp_promos').insert(fixture.promos)
        })
        afterEach('clean data',()=>{
            return db.raw('truncate flp_services, flp_clients restart identity cascade')
        })
        context(`POST - Given sufficient information`,()=>{
            it('Returns 200 when posting GOOD new client and data persists',()=>{
                const client = fixture.clients[0]
                return supertest(app)
                    .post('/api/clients/')
                    .send(client)
                    .expect(200)
                    .expect(fixture.clients_answer[0]).then(res=>{
                        //inspect data persists
                        return supertest(app)
                            .get(`/api/clients/${1}/`)
                            .expect(200)
                            .expect(fixture.clients_answer[0])
                    })
            })
        })
        context(`POST - Given insufficient information`,()=>{
            it(`Returns 400 when name is missing`,()=>{
                const client = {...fixture.clients[0]}
                client.name = ""
                return supertest(app)
                    .post(`/api/clients/`)
                    .send(client)
                    .expect(400)
                    .expect({error:"Name is required"})
            })

            it(`Returns 400 when email is missing`,()=>{
                const client = {...fixture.clients[0]}
                client.email= ""
                return supertest(app)
                    .post(`/api/clients/`)
                    .send(client)
                    .expect(400)
                    .expect({error:"Email is required"})
            })
            
            it(`Returns 400 when phone is missing`,()=>{
                const client = {...fixture.clients[0]}
                client.phone = ""
                return supertest(app)
                    .post(`/api/clients/`)
                    .send(client)
                    .expect(400)
                    .expect({error:`Phone is required`})
            })
        })
        context(`POST - Given duplicate email or phone`,()=>{
            beforeEach('place data',()=>{
                return db.into('flp_clients').insert(fixture.clients)
            })
            afterEach('clean data',()=>{
                return db.raw('truncate flp_services, flp_clients restart identity cascade')
            })
            it(`returns 400 with duplicate email message`,()=>{
                const client = {...fixture.clients[0]}  
                client.phone="111-222-1122" // changing the phone number so that it is no longer a duplicate
                return supertest(app)
                    .post(`/api/clients`)
                    .send(client)
                    .expect(400)
                    .expect({error:`A client with email - ${client.email} - already exists`})
            })
            it(`returns 400 with dupliate phone message`,()=>{
                const client = {...fixture.clients[1]}
                client.email="goodEmail@gmail.com"
                return supertest(app)
                    .post(`/api/clients`)
                    .send(client)
                    .expect(400)
                    .expect({error:`A client with phone - ${client.phone} -  already exits`})
            })
        })
          
    })
    describe(`GET /api/clients/:clientId/`,()=>{
        before('clean data',()=>{
            return db.raw('truncate flp_promos, flp_services, flp_clients,flp_user restart identity cascade')
        })
        before('setup user as foreign key',()=>{
            return db.into('flp_user').insert(fixture.user)
        })
        before('setup promos as foreign key',()=>{
            return db.into('flp_promos').insert(fixture.promos)
        })
        context(`Looking for existing data`,()=>{
            beforeEach('place data',()=>{
                return db.into('flp_clients').insert(fixture.clients)
            })
            afterEach('clean data',()=>{
                return db.raw('truncate flp_services, flp_clients restart identity cascade')
            })
            it(`Return 200 with desired client`,()=>{
                const clientId = 1
                return supertest(app)
                    .get(`/api/clients/${clientId}`)
                    .expect(200)
                    .expect(fixture.clients_answer[clientId-1])
            })
        })
        context(`Looking for non existing data`,()=>{
            it(`Returns 400 with an error message stating it doesnt exist`,()=>{
                const clientId = 50
                return supertest(app)
                    .get(`/api/clients/${clientId}`)
                    .expect(404)
                    .expect({error:`Client with Id ${clientId} does not exist.`})
            })
        })
    })
    describe(`DELETE /api/clients/:clientId/`,()=>{
        before('clean data',()=>{
            return db.raw('truncate flp_promos, flp_services, flp_clients,flp_user restart identity cascade')
        })
        before('setup user as foreign key',()=>{
            return db.into('flp_user').insert(fixture.user)
        })
        before('setup promos as foreign key',()=>{
            return db.into('flp_promos').insert(fixture.promos)
        })
        context(`Looking to delete data that does exist`,()=>{
            beforeEach('place data',()=>{
                return db.into('flp_clients').insert(fixture.clients)
            })
            afterEach('clean data',()=>{
                return db.raw('truncate flp_services, flp_clients restart identity cascade')
            })
            it(`returns 204 and successfully deletes data`,()=>{
                const clientId = 1
                return supertest(app)
                    .delete(`/api/clients/${clientId}`)
                    .expect(204).then(res=>{
                        return supertest(app)
                            .get(`/api/clients/${clientId}`)
                            .expect(404)
                    })
                    
            })

        })
        context(`Looking to delete data that does not exist`,()=>{
            beforeEach('place data',()=>{
                return db.into('flp_clients').insert(fixture.clients)
            })
            afterEach('clean data',()=>{
                return db.raw('truncate flp_services, flp_clients restart identity cascade')
            })
            it(`It returns 404 resource not found`,()=>{
                const clientId = 60005
                return supertest(app)
                    .delete(`/api/clients/${clientId}`)
                    .expect(404)
            })
        })
    })

    describe(`PATCH /api/clients/:clientId`,()=>{
        before('clean data',()=>{
            return db.raw('truncate flp_promos, flp_services, flp_clients,flp_user restart identity cascade')
        })
        before('setup user as foreign key',()=>{
            return db.into('flp_user').insert(fixture.user)
        })
        before('setup promos as foreign key',()=>{
            return db.into('flp_promos').insert(fixture.promos)
        })
        context(`Successful patch! lets Patch`,()=>{
            beforeEach('place data',()=>{
                return db.into('flp_clients').insert(fixture.clients)
            })
            afterEach('clean data',()=>{
                return db.raw('truncate flp_services, flp_clients restart identity cascade')
            })
            it(`Returns 200 when changing email correctly`,()=>{
            const clientId = 1 
            const newEmail = "somenewemail@hotmail.com"
            const updateCLient = {...fixture.clients_answer[clientId-1]}
            updateCLient.email = newEmail
            return supertest(app)
                .patch(`/api/clients/${clientId}`)
                .send({email:newEmail})
                .expect(200)
                .expect(updateCLient)
            }) 
            it(`Returns 200 when changing phone numbers correctly`,()=>{
                const clientId = 1 
                const newPhone = "123-456-7890"
                const updateCLient = {...fixture.clients_answer[clientId-1]}
                updateCLient.phone = newPhone
                return supertest(app)
                    .patch(`/api/clients/${clientId}`)
                    .send({phone:newPhone})
                    .expect(200)
                    .expect(updateCLient)
            })
            it(`Returns 200 when changing name correctly`,()=>{
                const clientId = 1 
                const newName = "my New Name"
                const updateCLient = {...fixture.clients_answer[clientId-1]}
                updateCLient.name = newName
                return supertest(app)
                    .patch(`/api/clients/${clientId}`)
                    .send({name:newName})
                    .expect(200)
                    .expect(updateCLient)
            })  
        })
        context(`Unsuccesful patch (duplicate/incorrect email/phone)`,()=>{
            beforeEach('place data',()=>{
                return db.into('flp_clients').insert(fixture.clients)
            })
            afterEach('clean data',()=>{
                return db.raw('truncate flp_services, flp_clients restart identity cascade')
            })
            it(`Returns 400 when client is updated with incorrect email format`,()=>{
                const clientId = 1
                const newEmail = "my new email"
                const updateCLient = {...fixture.clients_answer[clientId-1]}
                updateCLient.email = newEmail
                return supertest(app)
                    .patch(`/api/clients/${clientId}`)
                    .send({email:newEmail})
                    .expect(400)
                    .expect({error:`Client email - Please input a valid email address -such as- myEmail@gmail.com`})
            })
            it(`Returns 400 when client is updated with incorrect phone format`,()=>{
                const clientId= 1
                const newPhone  = "some New Phone"
                return supertest(app)
                    .patch(`/api/clients/${clientId}`)
                    .send({phone:newPhone})
                    .expect(400)
                    .expect({error:"Client phone - input in ###-###-#### "})
            })
            it(`Returns 400 when client is updated with existing phone number`,()=>{
                const clientId= 1
                const newPhone = fixture.clients[clientId].phone
                return supertest(app)
                    .patch(`/api/clients/${clientId}`)
                    .send({phone:newPhone})
                    .expect(400)
                    .expect({error:`A client with phone - ${newPhone} - already exists`})
            })
            it(`Returns 400 when client is updated with existing email `,()=>{
                const clientId= 1
                const newEmail = fixture.clients[clientId].email
                return supertest(app)
                    .patch(`/api/clients/${clientId}`)
                    .send({email:newEmail})
                    .expect(400)
                    .expect({error:`A client with email - ${newEmail} - already exists`})
            })
            

        })
    })
    after('disconnect from db',()=>{
        return db.destroy()
    })
})