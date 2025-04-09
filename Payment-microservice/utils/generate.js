const { v4:uuidv4 } = require('uuid');

const generatePaystackRefrence=()=>{
    return uuidv4()
}

module.exports ={generatePaystackRefrence}