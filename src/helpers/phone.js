function phoneCreate(phone){
    const myList = phone.split('')
    
    //created a Numbers only list
    const phoneList = []
    for (x in myList){
        if(!isNaN(myList[x])){
            phoneList.push(myList[x])
        }
    }
    
    let newPhone  = ""
    
    for (x in phoneList){
        if(x==3||x==6){
            newPhone = newPhone+"-"
        }
        newPhone = newPhone+phoneList[x]
    }
    return newPhone
}

module.exports = {
    phoneCreate
}