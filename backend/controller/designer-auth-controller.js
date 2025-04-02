const {matchedData, validationResult} = require("express-validator")
const  AppError  = require("../utils/appError")
const {registerDesignerService,loginDesignerService} = require("../services/designer-service")
const { createWalletService } = require("../services/wallet-service")




const registerDesigner = async(req,res,next)=>{
    const credentials = validationResult(req)
 try {
    if (!credentials.isEmpty()) {
        const err = credentials.array()
        const errMessage = err.map((error)=>error.msg)
        const appError = new AppError(errMessage, "failed", 400)
        throw appError
    }
    const fields = matchedData(req)

    const registered = await registerDesignerService(fields,next)
    if (!registered) {
      const err= new AppError("Error signing up..", "failed", 400)
      throw err
    }
    const createWallet = await createWalletService(registered.id,registered.email,next)
    if (createWallet) {
      console.log("wallet created")
    }
    return res.status(201).json({status:"success",data:registered})

 } catch (error) {
       return next(error)
 }
}




const loginDesigner=async(req,res,next)=>{
    const credentials = validationResult(req)
  
    try {
      if (!credentials.isEmpty()) {
        const err = credentials.array()
        const errMessage = err.map((error)=>error.msg)
        const appError = new AppError(errMessage, "failed", 400)
        throw appError
    }
    const fields = matchedData(req)
    const loggedIn = await loginDesignerService(fields,next)
    if (!loggedIn) {
      const err= new AppError("Error logging in up..", "failed", 400)
      throw err
    }
    return res.status(201).json({status:"success",data:loggedIn})
  
    } catch (error) {
      return next(error)
  
    }
  }


  module.exports= {registerDesigner, loginDesigner}