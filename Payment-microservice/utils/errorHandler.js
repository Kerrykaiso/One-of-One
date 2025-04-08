const AppError = require("../utils/appError")


const errorHandler= (err,req,res,next)=>{
    if (err instanceof AppError) {
        
         return res.status(err.statusCode || 500).json({message: err.message || "something went wrong" , status:err.status|| "server error"})

    }

    return res.status(500).json({message: err.message || "something went wrong" , status:err.status|| "server error"})
}

module.exports = errorHandler