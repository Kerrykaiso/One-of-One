const router  = require("express").Router()


router.get("/health",(req,res,next)=>{
    try {
        res.status(200).json({
            service: "backend gateway running",
            status: "ok"
        })
    } catch (error) {
        next(err)
    }
})

module.exports = router