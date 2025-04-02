const { submitController, approveDesignController, getSubmissionsController } = require("../controller/submit-design-controller")
const { upload } = require("../services/submit-design")

const router = require("express").Router()
router.get("/fetch-submissions",getSubmissionsController)
router.put("/design-approval/:id", approveDesignController)
router.post("/submit-design",upload.fields([{name:"mockups"},{name:"designs"}]) ,submitController)


module.exports =router