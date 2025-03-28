const { submitDesignService, approveDesignService } = require("../services/submit-design")
const AppError = require("../utils/appError")

const submitController=async(req,res,next)=>{
 try {
   const userData = req.data
   const mockupImages = req.files["mockups"];
   const designImages = req.files["designs"];
    const submitSuccess = await submitDesignService(mockupImages,designImages,userData,next)
    if (!submitSuccess) {
        const appErr = new AppError("failed to upload,something went wrong","failed",400)
        throw appErr
    }
    res.status(201).json("submitted success")
 } catch (error) {
    return next(error)
 }
}


const  approveDesignController =async(req,res,next)=>{
 try {
   const data = req.body
   const id = req.params.id
   const status = await approveDesignService(data,id,next)

   if (!status) {
      const appErr = new AppError("Could not approve design, something went wrong","failed",400)
      throw appErr
   }

   //send mail
  
 } catch (error) {
   return next(error)
 }
}
module.exports={submitController}