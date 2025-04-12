const winston = require("winston")

const logger  = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({timestamp,level,message})=>{
           return `${timestamp}-[${level.toUpperCase()}]-${message}`
        })
    ),
    transports:[
        new winston.transports.Console(),
        new winston.transports.File({filename:"./logger-messages.log"})
    ]
})

module.exports = logger