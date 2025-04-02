const otpService = require("../services/verify-otp")
const AppError = require("../utils/appError")
const {matchedData, validationResult} = require("express-validator")
const otpController =async(req,res,next)=>{
  try {
    const credentials = validationResult(req)

    if (!credentials.isEmpty()) {
      const err = credentials.array()
      const errMessage = err.map((error)=>error.msg)
      const appError = new AppError(errMessage, "failed", 400)
      throw appError
  }
  const field = matchedData(req)
    const verifiedOTP = await otpService(field,next)
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