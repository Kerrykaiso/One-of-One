const {parentPort,workerData} = require("worker_threads")
const Qrcode  = require("qrcode")
const cloudinary = require("../config/cloudinary.config")
const streamifer = require("streamifier")

const uploadImagestoCloudinary = async()=>{
  try {
    const {mockupImages,designImages,id} =workerData
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
       const domain = process.env.DOMAIN
       const productURL = `${domain}/products/${id}`
       const qrBuffer = await Qrcode.toBuffer(productURL)

       const qrCodeResult =  await new Promise((resolve,reject)=>{
        const stream  = cloudinary.uploader.upload_stream(
          {
            folder:"oneofone_qrcode",
            public_id: `product-${id}`,
            resource_type: "image"

          },(error,result)=>{
            if (result) resolve(result)
              else reject(error)
          }
        )
       streamifer.createReadStream(qrBuffer).pipe(stream)
       })
     
      parentPort.postMessage({mockupURLs,designsURLs,qrCodeUrl: qrCodeResult.secure_url})
  } catch (error) {
      parentPort.postMessage({error:error.messages})
  }
}
uploadImagestoCloudinary()