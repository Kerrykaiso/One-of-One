const {rateLimit} = require("express-rate-limit")

const loginRateLimit = rateLimit({
    windowMs:3*60*60*1000,
    max:5,
    standardHeaders: true,
    legacyHeaders: true,
    message: "Too many request, try again later",
    skipSuccessfulRequests:true
})

const registerRateLimit = rateLimit({
    windowMs:3*60*60*1000,
    max:5,
    standardHeaders: true,
    legacyHeaders: true,
    message: "Too many request, try again later",
    skipSuccessfulRequests:true
})

const verifyOTPRateLimit = rateLimit({
    windowMs:3*60*60*1000,
    max:3,
    standardHeaders: true,
    legacyHeaders: true,
    message: "Too many request, try again later",
    skipSuccessfulRequests:true
})
module.exports={loginRateLimit,registerRateLimit,verifyOTPRateLimit}