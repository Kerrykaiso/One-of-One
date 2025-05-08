const { submitController, approveDesignController, getSubmissionsController, getSubmissionById } = require("../controller/submit-design-controller")
const { designerAuth } = require("../middlewares/jwt")
const { upload } = require("../services/submit-design")

const router = require("express").Router()
router.get("/get-submissions",getSubmissionsController)
router.get("/find-submission/:id", getSubmissionById)
router.put("/design-approval/:id", approveDesignController)
router.post("/submit-design",designerAuth,upload.fields([{name:"mockups"},{name:"designs"}]),submitController)


module.exports =router