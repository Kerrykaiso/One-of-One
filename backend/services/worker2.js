const {parentPort,workerData} = require("worker_threads")
const cloudinary = require("../config/cloudinary.config")


const uploadToCloudinary =async()=>{
 try {
    const {productImage} = workerData

    const shirtImage = []

    for (file of productImage || []) {
       const response = await cloudinary.uploader.upload(file.path,{resource_type:"image",folder:"oneofone_shirts"})
           shirtImage.push(response.secure_url)
    }
    parentPort.postMessage({shirtImage})
 } catch (error) {
    parentPort.postMessage({error:error.messages})
 }
}

uploadToCloudinary()