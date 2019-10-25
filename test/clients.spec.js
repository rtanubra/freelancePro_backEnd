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
        context(`Given sufficient information`,()=>{
            it('Returns 200 when posting GOOD new client and data persists',()=>{
                const client = fixture.clients[0]
                return supertest(app)
                    .post('/api/clients/')
                    .send(client)
                    .expect(200)
                    .expect(fixture.clients_answer[0])
            })
        })
        context.only(`Given insufficient information`,()=>{
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

        })
          
    })
    after('disconnect from db',()=>{
        return db.destroy()
    })
})