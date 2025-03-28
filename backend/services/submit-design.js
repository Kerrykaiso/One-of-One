const cloudinary = require("../config/cloudinary.config")
const multer  = require("multer");
const {Submission} = require("../models")
const {Stock} = require("../models")
const AppError = require("../utils/appError");


const  submitDesignService = async(mockupImages,designImages,userData,next)=>{
    try { 

        if (!mockupImages ||!designImages) {
          const appErr = new AppError("No image(s) provided","failed",400)
          throw appErr
      }

      //check if selected color is still available

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
        designerId: userData.id,
        designerName: userData.name,
        designerEmail: userData.email,
        color: "blue",
        status:"pending",
        mockupURLs:stringMockup,
        designsURLs:stringDesign
      })
      if (!createSubmission) {
        const err = new AppError("error adding submission to db", "failed", 400)
        throw err
      } 

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




const approveDesignService = async(data,id,next)=>{
  try {
    const findSubmission = await Submission.findByPk(id)

    if (!findSubmission) {
      const appErr = new AppError("can not find submission","failed", 400)
      throw appErr
    }
    const updated = await findSubmission.update(data)

    if (!updated) {
       const appErr = new AppError("Could not update submission","failed", 400)
      throw appErr 
    }
    

    if (updated.status==="approved") {
       const stock = await Stock.findOne({where:{color:updated.color},raw:true})
       await stock.decrement("number", {by:1})
    }
    return updated

  } catch (error) {
     return next(error)
  }
}


module.exports={upload,submitDesignService,approveDesignService}