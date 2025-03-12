const router = require("express").Router()
const {loginRateLimit, registerRateLimit} = require("../config/rate-limit")
const { registerDesigner,loginDesigner } = require("../controller/designer-auth-controller")
//const { designerAuth } = require("../middlewares/jwt")
const { registerDesignerBody,loginBody } = require("../utils/utils")


router.post("/register-designer",registerDesignerBody,registerRateLimit,registerDesigner)
router.post("/login-designer",loginBody,loginRateLimit,loginDesigner)
// router.get("/testing", designerAuth, (req,res)=>{
//     res.status(200).json("worked")
// })


module.exports= router