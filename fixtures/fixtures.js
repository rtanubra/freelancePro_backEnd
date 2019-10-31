clients=[
    {name:"Mundy Moon",email:"mundymoon@gmail.com",phone:"555-334-1234",user_id:1,open_promo:1},
    {name:"Bundy Boon",email:"bundyboon@gmail.com",phone:"535-334-1234",user_id:1,open_promo:2}
]
clients_answer=[
    {id:1,name:"Mundy Moon",email:"mundymoon@gmail.com",phone:"555-334-1234",user_id:1,open_promo:1},
    {id:2,name:"Bundy Boon",email:"bundyboon@gmail.com",phone:"535-334-1234",user_id:1,open_promo:2}
]
user=[
    {email:"rdtanubrata@gmail.com",password:"test1"}
]
promos=[
    {name:"10-Spring2019",description:"Give 10% off to select clients,Started October 2019",date_created: "2019-10-20T04:00:00.000Z",date_ending: "2021-10-20T04:00:00.000Z"},
    {name:"5-Spring2019",description:"Give 5% off to all clients.",date_created: "2019-10-20T04:00:00.000Z",date_ending: "2021-10-20T04:00:00.000Z"}

]
promos_answer = [
    {id:1,name:"10-Spring2019",description:"Give 10% off to select clients,Started October 2019",date_created: "2019-10-20T04:00:00.000Z",date_ending: "2021-10-20T04:00:00.000Z"},
    {id:2,name:"5-Spring2019",description:"Give 5% off to all clients.",date_created: "2019-10-20T04:00:00.000Z",date_ending: "2021-10-20T04:00:00.000Z"} 
]
services=[
    {notes:"Hair and Makeup",cost:600,people:3,promo_id:1,client_id:1},
    {notes:"Moustache",cost:200,people:1,promo_id:1,client_id:1},
    {notes:"Hair",cost:400,people:2,promo_id:2,client_id:2}
]
services_answer=[
    {client_id:1,cost:600,id:1,notes:"Hair and Makeup",people:3,promo_id:1},
    {client_id:1,cost:200,id:2,notes:"Moustache",people:1,promo_id:1},
    {client_id:2,cost:400,id:3,notes:"Hair",people:2,promo_id:2}
]
userNoCreds = {
    email:'rdtanubrata@fmail.com',
    id:3
}

module.exports={
    clients,
    clients_answer,
    user,
    promos,
    services,
    services_answer,
    promos_answer,
    userNoCreds
}