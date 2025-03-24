const router = require("express").Router()
const { googleAuth, instantiateGoogle } = require("../controller/google-controller")
const passport = require("passport")

router.get("/google",instantiateGoogle)
router.get("/google/callback",passport.authenticate("google",{session:false}) ,googleAuth)

module.exports =router