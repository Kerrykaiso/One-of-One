const router = require("express").Router()
const { profileController, editProfileController } = require("../controller/designer-profile-controller")
const { editProfile } = require("../utils/utils")



router.put("/edit-profile/:id",editProfile, editProfileController)
router.get("/get-profile/:id", profileController)


module.exports =router