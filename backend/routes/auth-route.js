const router = require("express").Router()
const {loginRateLimit, registerRateLimit} = require("../config/rate-limit")
const { registerUser, loginUser } = require("../controller/auth-controlller")
const { registerUserBody,loginBody } = require("../utils/utils")


router.post("/register-customer",registerUserBody, registerRateLimit,registerUser)
router.post("/login-customer",loginBody,loginRateLimit,loginUser)


module.exports= router