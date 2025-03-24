const otpService = require("../services/verify-otp")
const AppError = require("../utils/appError")

const otpController =async(req,res,next)=>{
  try {

    const {otp,email} = req.body
    if (!otp) {
       const appErr =  new AppError("Please provide an OTP", "failed", 400)
       throw appErr
    }
    const verifiedOTP = await otpService(email,otp,next)
    if (!verifiedOTP) {
        const appErr =  new AppError("Incorrect OTP", "failed", 400)
        throw appErr 
    }
    res.status(200).json("verified")
  } catch (error) {
    next(error)
  }
}
module.exports ={otpController}