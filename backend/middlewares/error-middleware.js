const AppError = require("../utils/appError")

const throwAppError=(err,res)=>{

  return  res.status(err.statusCode).json({
        status:err.status,
        message: err.message,
        statusCode: err.statusCode
    })
}
const errorHandler= (err,req,res,next)=>{
    if (err instanceof AppError) {
        
         //throwAppError(err,res)
         return res.status(err.statusCode || 500).json({message: err.message || "something went wrong" , status:err.status|| "server error"})

    }

    return res.status(500).json({message: err.message || "something went wrong" , status:err.status|| "server error"})
}

module.exports = errorHandler