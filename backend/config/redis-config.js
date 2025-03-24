const redis = require("redis")


let client
const initializerRedis=async()=>{
 if (!client) {
    client = redis.createClient({socket:{
        host:"localhost",
        port: 6379
    }})
    client.on("error",(err)=>{
        throw new Error(err)
    })
    client.on("connect",()=>{
        console.log("Redis connected successfully")
    })
   await client.connect()
 }
 return client
}

module.exports ={initializerRedis}