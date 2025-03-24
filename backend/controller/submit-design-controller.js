const { submitDesignService } = require("../services/submit-design")
const AppError = require("../utils/appError")

const submitController=async(req,res,next)=>{
 try {
   const mockupImages = req.files["mockups"];
   const designImages = req.files["designs"];
    const submitSuccess = await submitDesignService(mockupImages,designImages,next)
    if (!submitSuccess) {
        const appErr = new AppError("failed to upload,something went wrong","failed",400)
    }
    res.status(201).json("submitted success")
 } catch (error) {
    next(error)
 }
}

module.exports={submitController}