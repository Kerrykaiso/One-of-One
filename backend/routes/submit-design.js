const { submitController } = require("../controller/submit-design-controller")
const { upload } = require("../services/submit-design")

const router = require("express").Router()

router.post("/submit-design",upload.fields([{name:"mockups"},{name:"designs"}]) ,submitController)


module.exports =router