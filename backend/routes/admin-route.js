const router = require("express").Router()
const {loginRateLimit, registerRateLimit} = require("../config/rate-limit")
const {registerCeo,registerManager,registerSalesPerson,loginAdmin} = require("../controller/admin-controller")
const { registerUserBody,loginBody } = require("../utils/utils")


router.post("/register-ceo",registerUserBody, registerRateLimit,registerCeo)
router.post("/register-mananger",registerUserBody,registerRateLimit,registerManager)
router.post("/register-sales",registerUserBody,registerRateLimit, registerSalesPerson)
router.post("/login-admin",loginBody,loginRateLimit,loginAdmin)


module.exports= router