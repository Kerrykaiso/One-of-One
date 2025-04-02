const { profileService, editProfileService } = require("../services/designer-profile")
const {validationResult,matchedData} = require("express-validator")
const AppError = require("../utils/appError")
const { escapeHtml } = require("../utils/emailUtils")

const profileController =async(req,res,next)=>{
    const id = req.params.id
    try {
        const profile = await profileService(escapeHtml(id),next)
        if (!profile) {
         const appErr = new AppError("Problem getting profile","failed",400)
         throw appErr
        }
    res.status(200).json(profile)
    } catch (error) {
        return next(error)
    }
}

const editProfileController =async(req,res,next)=>{
    const credentials = validationResult(req)
    const id = req.params.id
    try {
        if (!credentials.isEmpty()) {
            const err = credentials.array()
            const errMessage = err.map((error)=>error.msg)
            const appError = new AppError(errMessage, "failed", 400)
            throw appError
        }
       const fields = matchedData(req)
       const editProfile = await editProfileService(escapeHtml(id),fields,next)
     if (!editProfile) {
        const appErr = new AppError("error editing profile","failed",400)
        throw appErr    
    }
     res.status(200).json(editProfile)
    } catch (error) {
     return next(error)
    }
}

module.exports ={profileController,editProfileController}