const {matchedData, validationResult} = require("express-validator")
const  AppError  = require("../utils/appError")
const { registerCustomerService, loginCustomerService } = require("../services/auth-service")


const registerUser = async(req,res,next)=>{
    const credentials = validationResult(req)
 try {
    if (!credentials.isEmpty()) {
        const err = credentials.array()
        const errMessage = err.map((error)=>error.msg)
        const appError = new AppError(errMessage, "failed", 400)
        throw appError
    }
    const fields = matchedData(req)

    const registered = await registerCustomerService(fields,next)
    if (!registered) {
      const err= new AppError("Error signing up..", "failed", 400)
      throw err
    }
    
    return res.status(201).json({status:"success",data:registered})

 } catch (error) {
       return next(error)
 }
}

  const loginUser=async(req,res,next)=>{
  const credentials = validationResult(req)

  try {
    if (!credentials.isEmpty()) {
      const err = credentials.array()
      const errMessage = err.map((error)=>error.msg)
      const appError = new AppError(errMessage, "failed", 400)
      throw appError
  }
  const fields = matchedData(req)
  const loggedIn = await loginCustomerService(fields,next)
  if (!loggedIn) {
    const err= new AppError("Error logging in...", "failed", 400)
    throw err
  }
  return res.status(200).json({status:"success",data:loggedIn})

  } catch (error) {
    return next(error)

  }
}

module.exports = {registerUser,loginUser}