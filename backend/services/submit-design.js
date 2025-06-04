const multer  = require("multer");
const {Worker} = require("worker_threads")
const {Submission} = require("../models")
const {Stock} = require("../models")
const uuid = require("uuid")
const {Designer} = require("../models")
const AppError = require("../utils/appError");


const  submitDesignService = async(mockupImages,designImages,userData,color,designName,price,category,size,next)=>{
  let id
    try { 
        if (!mockupImages || !designImages) {
          const appErr = new AppError("No image(s) provided","failed",400)
          throw appErr
      }
     const designer= await Designer.findByPk(userData.id)
     const tier = designer.get({plain:true}).tier
      //check if selected color is still available

     
    
   
      const uploadImagestoWorker = (mockupImages,designImages)=>{
         id = uuid.v4()
        return new Promise((resolve,reject)=>{
          const worker = new Worker("./services/worker.js", {workerData:{mockupImages,designImages,id}})
          worker.on("message",(result)=>{
            // if (result.error) {
            //   console.log(result.error)
            //   return reject(new AppError("error","failed", 400))
            // }
            console.log(result)
            resolve(result)
          })
         // worker.on("error",reject(new AppError("something went wrong in the image upload", "failed",400)))
          worker.on("exit",(code)=>{
            if (code != 0) {
              reject(new AppError(code, "failed", 400))
            }
          })
        })

      }
      const {mockupURLs,designsURLs, qrCodeUrl} = await uploadImagestoWorker(mockupImages,designImages)
      if (!mockupURLs?.length && !designsURLs?.length) {
        return false
      }
      const stringDesign = JSON.stringify(designsURLs)
      const stringMockup = JSON.stringify(mockupURLs)
      const sameName = await Submission.findOne({where:{name:userData.name}})
      if (sameName) {
        const err = new AppError("This name already exists for another product", "failed", 400)
        throw err
      }
      const createSubmission = await Submission.create({
        id:id,
        size,
        designerId: userData.id,
        name:userData.name,
        designerName: userData.name,
        designerEmail: userData.email,
        category,
        qrCodeUrl,
        designName,
        price: price,
        color: color,
        status:"pending",
        mockupURLs:stringMockup,
        designsURLs:stringDesign,
        designerTier: tier
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
     const updated =  await findSubmission.update(data)
    if (!updated) {
       const appErr = new AppError("Could not update submission","failed", 400)
      throw appErr 
    }
    
       const plain = updated.get({plain:true})
    if (plain.status==="accepted") {
       const stock = await Stock.findOne({where:{color:updated.color}})
       await stock.decrement("number", {by:1})
    }
    return plain

  } catch (error) {
     return next(error)
  }
}

const getSubmissionsService = async(next)=>{
  try {
    const allSubmissions = await Submission.findAll({
      order: [["createdAt", "DESC"]]
    },{raw:true})
    if (!allSubmissions) {
      const appErr = new AppError("No submissions yet", "success", 200)
      throw appErr
    }
   
   return allSubmissions
  } catch (error) {
    next(error)
  }
}

const getSubmissionsById = async(id,next)=>{
 try {
  const submission = await Submission.findByPk(id)

  if (!submission) {
      const appErr = new AppError("Submission not found", "failed", 404)
      throw appErr
    }
    const submissionDetails = submission.get({plain:true})
    return submissionDetails
  } catch (error) {
   next(error)
 }
}


const getAcceptedDesigns = async(next)=>{

  try {
    const acceptedDesigns  =  await Submission.findAll({where:{status:"accepted"},order:[["createdAt", "DESC"]],raw:true})
    if (!acceptedDesigns.length ) {
      return {message:"No approved submissions yet"}
    }
    return acceptedDesigns

  } catch (error) {
    next(error)
  }
}

const createProductFromSubmission =async (id,productImages,next)=>{
  try {
    if (!productImages) {
      const appErr = new AppError("No image(s) provided","failed",400)
      throw appErr
    }
    let findSubmission = await Submission.findByPk(id)
    
    const uploadImagestoWorker = (productImages)=>{
     return new Promise((resolve,reject)=>{
       const worker = new Worker("./services/worker2.js", {workerData:{productImages}})
       worker.on("message",(result)=>{
     
         console.log(result)
         resolve(result)
       })
      // worker.on("error",reject(new AppError("something went wrong in the image upload", "failed",400)))
       worker.on("exit",(code)=>{
         if (code != 0) {
           reject(new AppError(code, "failed", 400))
         }
       })
     })
   }
    
   const  {shirtImage} = uploadImagestoWorker(productImages)
   if (!shirtImage.length) {
    return false
   }

   const stringifyShirtImage = JSON.stringify(shirtImage)
   const submissionUpdate = findSubmission.update({status:"listed"})
   if (!submissionUpdate) {
    const err = new AppError("Error updating submission", "failed",400)
    throw err
   }
   const submisionData = submissionUpdate.get({plain:true})

   const createProductDetails = {
    status :submisionData.status,
    designerEmail: submisionData.designerEmail,
    id:submisionData.id,
    name: submisionData.name,
    designerName: submisionData.designName,
    category: submisionData.category,
    price : submisionData.price,
    size:submisionData.size,
    productImage: stringifyShirtImage,
    designer_id: submisionData.designerId,
    description: submisionData.description,
    color: submisionData.color
   }

   return createProductDetails

  } catch (error) {
    next(error)
  }
}
module.exports={upload,submitDesignService,approveDesignService,getSubmissionsService,getSubmissionsById,createProductFromSubmission,getAcceptedDesigns}