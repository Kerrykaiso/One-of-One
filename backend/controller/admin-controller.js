const { createCeoService, createManagerService, createSalesPersonService, loginAdminService } = require("../services/admin-service")
const AppError = require("../utils/appError")
const {matchedData, validationResult} = require("express-validator")



const registerCeo=async(req,res,next)=>{
    const credentials = validationResult(req)
    try {
        if (!credentials.isEmpty()) {
            const err = credentials.array()
            const errMessage = err.map((error)=>error.msg)
            const appError = new AppError(errMessage, "failed", 400)
            throw appError
        }
        const fields = matchedData(req)
        const creatCeo = await createCeoService(fields,next)

        if (!creatCeo) {
            const appError = new AppError("Error registering ceo", "failed", 400)
            throw appError
        }
      
      res.status(201).json({status:"success", data: creatCeo})

    } catch (error) {
         next(error)
    }
}


const registerManager=async(req,res,next)=>{
    const credentials = validationResult(req)
    try {
        if (!credentials.isEmpty()) {
            const err = credentials.array()
            const errMessage = err.map((error)=>error.msg)
            const appError = new AppError(errMessage, "failed", 400)
            throw appError
        }
        const fields = matchedData(req)
        const createManager = await createManagerService(fields,next)

        if (!createManager) {
            const appError = new AppError("Error registering manager", "failed", 400)
            throw appError 
        }
        res.status(201).json({status:"success", data: createManager})

    } catch (error) {
        next(error)
    }
}


const registerSalesPerson=async(req,res,next)=>{
    const credentials = validationResult(req)
    try {
        if (!credentials.isEmpty()) {
            const err = credentials.array()
            const errMessage = err.map((error)=>error.msg)
            const appError = new AppError(errMessage, "failed", 400)
            throw appError
        }
        const fields = matchedData(req)
        const createSalesPerson = await createSalesPersonService(fields,next)

        if (!createSalesPerson) {
            const appError = new AppError("Error registering manager", "failed", 400)
            throw appError 
        }
        res.status(201).json({status:"success", data: createSalesPerson})

    } catch (error) {
        next(error)
    }
}

const loginAdmin =async(req,res,next)=>{
    const credentials = validationResult(req)
   try {
    if (!credentials.isEmpty()) {
        const err = credentials.array()
        const errMessage = err.map((error)=>error.msg)
        const appError = new AppError(errMessage, "failed", 400)
        throw appError
    }
    const fields = matchedData(req)
    const loginAdmin = await loginAdminService(fields,next)
    if (!loginAdmin) {
        const appError = new AppError("Error loggin in", "failed", 400)
        throw appError 
    }
    res.status(200).json({status:"success", data: loginAdmin})
   } catch (error) {
      next(error)
   }
}

module.exports={registerCeo,registerManager,registerSalesPerson,loginAdmin}