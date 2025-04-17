const { initializerRedis } = require("../config/redis-config")
const {Testing} = require("../models")

const router = require("express").Router()

router.get("/home",(req,res)=>{
    res.send("<a href='/auth/google'>login with google<a/>")
})
router.get("/test", async(req,res)=>{
    try {
    //     const cache = await initializerRedis()
    //     let designers =await cache.get("designers")

    //     if (designers) {
    //         console.log("cache hit")
    //         return res.json(JSON.parse(designers))
    //     }
    //   designers = await Designer.findAll()
    //   await cache.setEx("designers",3600,JSON.stringify(designers))
    //   console.log("cache miss")
    //   return res.json(designers)
    const findTest = await Testing.findOne({where:{number:9},raw:true})
    //const plain = findTest.get({plain:true})
    // const increased = await findTest.increment("number",{by: parseInt(2)})
    // const created = increased.get({plain:true})
        console.log(findTest)
  //  const updatedAmount=  await findTest.increment("balance",{by:creditAmount,transaction})

    } catch (error) {
       // throw new Error(error.msg)
    }
})
router.get("/test-session",(req,res)=>{
    res.json({role:req.session.role})
})
module.exports =router