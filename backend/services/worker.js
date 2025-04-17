const {parentPort,workerData} = require("worker_threads")
const cloudinary = require("../config/cloudinary.config")

const uploadImagestoCloudinary = async()=>{
  try {
    const {mockupImages,designImages} =workerData
    const mockupURLs =[]
    const designsURLs = []

     for (const file of mockupImages || []){
        const response = await cloudinary.uploader.upload(file.path,{resource_type:"image",folder:"oneofone_mockups"})
        mockupURLs.push(response.secure_url)
      }
        for (const file of designImages || []){
        const response = await cloudinary.uploader.upload(file.path,{resource_type:"image",folder:"oneofone_designs"})
        designsURLs.push(response.secure_url)
      }
      parentPort.postMessage({mockupURLs,designsURLs})
  } catch (error) {
      parentPort.postMessage({error:error.messages})
  }
}
uploadImagestoCloudinary()