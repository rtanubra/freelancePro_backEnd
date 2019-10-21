const ValidateHelper = {
    nameCheck(name){
        if (name.length<3 || name.length >15){
            return [false,"Should be between 3-15 characters"]
        }
        if (name.startsWith(" ")|| name.endsWith(" ")){
            return [false,"Should not begin or end with a space ' '. "]
        }
        const patStart = /^[_.]/
        const patEnd = /[_.]$/
        if (patStart.test(name)||patEnd.test(name) ){
            return [false, "Should not begin or end with a '_' or '.' "]
        }
        const patAlpha = /[a-zA-Z]/
        if(!patAlpha.test(name)){
            return [false, "Should contain alphabetical characters"]
        }
        const patBadCharacters = /[^a-zA-Z_. 0-9']/
        if(patBadCharacters.test(name)){
            return [false,"Should only contain alphanumeric, underscores '_', periods'.' spaces ' ' ."]
        }
        return [true,0]
    },
    emailChek(email){
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(email.toLowerCase())){
            return [false,"Please input a valid email address -such as- myEmail@gmail.com"]
        }
        return [true, 0]
    },
    phoneCheck(phone){
        var re = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/
        if (!re.test(phone)){
            return [false,"input in ###-###-#### "]
        }
        return [true,0]
    },
    user_nameCheck(name){
        if (name.length<4 || name.length>20){
            return [false,"Should be between 4-20 characters"]
        }
        if (name.indexOf(' ')>=0){
            return [false,"Should not contain a space ' '. "]
        }
        const patStart = /^[_.]/
        const patEnd = /[_.]$/
        if (patStart.test(name)||patEnd.test(name) ){
            return [false, "Should not begin or end with a '_' or '.' "]
        }
        const patAlpha = /[a-zA-Z]/
        if(!patAlpha.test(name)){
            return [false, "Should contain alphabetical characters"]
        }
        const patBadCharacters = /[^a-zA-Z _.0-9]/
        if(patBadCharacters.test(name)){
            return [false,"Should only contain alphanumeric, underscores '_', periods'.'."]
        }
        return [true,0]
    },

    passwordCheck(password){
        if (password.length<4 || password.length>20){
            return [false,"Should be between 4-20 characters"]
        }
        if (password.startsWith(' ')||password.startsWith(' ')){
            return [false,"Should not begin or end with a space ' '. "]
        }
        const patNumber = /[0-9]/
        const patAlpha = /[a-z]/
        const patAlphaCap = /[A-Z]/
        if ( ! patNumber.test(password) || !patAlpha.test(password) || !patAlphaCap.test(password) ){
            return [false,"Should contain at least a single lower case, upper case, and one number"]
        } 
        return [true,0]
    }
}
module.exports = ValidateHelper