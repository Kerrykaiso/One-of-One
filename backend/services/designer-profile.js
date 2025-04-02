const {Designer} = require("../models")
const AppError = require("../utils/appError")

const profileService=async(id,next)=>{
    try {
        const designerData = await Designer.findByPk(id,{attributes:["id","email","name","X","pinterest","instagram"]})
        if (!designerData) {
            const appErr = new AppError("could not find designer profile","failed",400)
            throw appErr
        }
        return designerData
    } catch (error) {
       return next(error) 
    }
}

const editProfileService = async(id,data,next)=>{
    try {
        const findDesigner = await Designer.findByPk(id)
        if (!findDesigner) {
            const appErr = new AppError("could not find designer profile","failed",400)
            throw appErr  
        }
        const updateProfile = await findDesigner.update(data)
        if (!updateProfile) {
            const appErr = new AppError("could not update profile","failed",400)
            throw appErr  
        }
        return updateProfile
    } catch (error) {
        return next(error)
    }
}
module.exports={profileService,editProfileService}