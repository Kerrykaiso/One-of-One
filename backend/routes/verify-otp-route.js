const router = require("express").Router()
const { verifyOTPRateLimit } = require("../config/rate-limit")
const { otpController } = require("../controller/otp-controller")
const { otp } = require("../utils/utils")



router.post("/verify-otp",otp,verifyOTPRateLimit,otpController)

module.exports =router