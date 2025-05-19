const { initializerRedis } = require("../config/redis-config")
const {Testing} = require("../models")

const router = require("express").Router()

router.get("/home",(req,res)=>{
    res.send("<a href='/auth/google'>login with google<a/>")
})
router.put("/test", async(req,res)=>{
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
    const findTest = await Testing.findByPk(1)
    //const plain = findTest.get({plain:true})
    const decrease = await findTest.update({number:20})
     const created = decrease.get({plain:true})
        console.log(created)
  //  const updatedAmount=  await findTest.increment("balance",{by:creditAmount,transaction})

    } catch (error) {
        throw new Error(error.message)
    }
})
router.get("/test-session",(req,res)=>{
    res.json({role:req.session.role})
})
module.exports =router