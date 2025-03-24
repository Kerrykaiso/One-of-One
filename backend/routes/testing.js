const { initializerRedis } = require("../config/redis-config")
const {Designer} = require("../models")

const router = require("express").Router()

router.get("/home",(req,res)=>{
    res.send("<a href='/auth/google'>login with google<a/>")
})
router.get("/profile", async(req,res)=>{
    try {
        const cache = await initializerRedis()
        let designers =await cache.get("designers")

        if (designers) {
            console.log("cache hit")
            return res.json(JSON.parse(designers))
        }
      designers = await Designer.findAll()
      await cache.setEx("designers",3600,JSON.stringify(designers))
      console.log("cache miss")
      return res.json(designers)

    } catch (error) {
        throw new Error(error.msg)
    }
})
router.get("/test-session",(req,res)=>{
    res.json({role:req.session.role})
})
module.exports =router