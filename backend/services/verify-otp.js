const {OTP,Designer} = require("../models")
const AppError = require("../utils/appError")
const bcrypt = require("bcryptjs")


const otpService=async(email,otp,next)=>{
  try {
    const findOTP = await OTP.findOne({where:{email:email},raw:true})
    if (!findOTP) {
        const appErr = new AppError("Designer does not exist","failed", 400)
        throw appErr
    }

    const isMatch = bcrypt.compare(otp,findOTP.otp)
    if (!isMatch) {
      const appErr = new AppError("Incorrect otp","failed", 400)
      throw appErr
    }
    const otpAge = (new Date()-new Date(findOTP.timestamp))/(1000*60*60)

    if (otpAge > 1) {
      const appErr = new AppError("This OTP has expired","failed", 400)
      throw appErr
    }
    await Designer.update({isverified:true},{where:{email}})
    await findOTP.destory()
    return true
     
  } catch (error) {
      next(error)
  }
}

module.exports= otpService