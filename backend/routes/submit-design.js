const { submitController, approveDesignController, getSubmissionsController } = require("../controller/submit-design-controller")
const { designerAuth } = require("../middlewares/jwt")
const { upload } = require("../services/submit-design")

const router = require("express").Router()
router.get("/fetch-submissions",getSubmissionsController)
router.put("/design-approval/:id", approveDesignController)
router.post("/submit-design",designerAuth,upload.fields([{name:"mockups"},{name:"designs"}]),submitController)


module.exports =router