const cloudinary = require("../config/cloudinary.config")
const multer  = require("multer");
const {Submission} = require("../models")
const AppError = require("../utils/appError");


const  submitDesignService = async(mockupImages,designImages,next)=>{
    try { 
        //const {email,id,name} = req.data

        if (!mockupImages ||!designImages) {
          const appErr = new AppError("No image(s) provided","failed",400)
          throw appErr
      }
      const mockupURLs = []
      for (const file of mockupImages){
        const response = await cloudinary.uploader.upload(file.path,{resource_type:"image",folder:"oneofone_mockups"})
        mockupURLs.push(response.secure_url)
      }
      const designsURLs = []
      for (const file of designImages){
        const response = await cloudinary.uploader.upload(file.path,{resource_type:"image",folder:"oneofone_designs"})
        designsURLs.push(response.secure_url)
      }

      if (!mockupURLs?.length && !designsURLs?.length) {
        return false
      }
      const stringDesign = JSON.stringify(designsURLs)
      const stringMockup = JSON.stringify(mockupURLs)
      const createSubmission = await Submission.create({
        designerId: "123456",
        designerName: "kachi",
        designerEmail: "kachi@gmail.com",
        color: "blue",
        status:"pending",
        mockupURLs:stringMockup,
        designsURLs:stringDesign
      })
      if (!createSubmission) {
        const err = new AppError("error adding submission to db", "failed", 400)
        throw err
      } 
      console.log("here!!")

      return true

    } catch (error) {
        next(error)
    }
}


const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });



module.exports={upload,submitDesignService}