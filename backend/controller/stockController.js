const AppError = require("../utils/appError")
const { createStock } = require("../services/createStock")
const {matchedData, validationResult} = require("express-validator")


const stockController =async(req, res,next) => {
    const credentials = validationResult(req)
    try {
        if (!credentials.isEmpty()) {
            const err = credentials.array()
            const errMessage = err.map((error)=>error.msg)
            const appError = new AppError(errMessage, "failed", 400)
            throw appError
        }
        const fields = matchedData(req)
    
        const stock = await createStock(fields,next)
        if (!stock) {
            const appErr = new AppError("failed to create stock, something went wrong","failed",400)
            throw appErr
        }
        res.status(201).json({status:"success",data:stock})
    } catch (error) {
        return next(error)
    }
}

module.exports = { stockController }