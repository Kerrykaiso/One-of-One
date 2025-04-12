const logger = require("../config/logger")
const AppError = require("../utils/appError")


const errorHandler= (err,req,res,next)=>{
    if (err instanceof AppError) {
        
         logger.error(`Error in API ${req.originalUrl} - ${err.message}`)
         return res.status(err.statusCode || 500).json({message: err.message || "something went wrong" , status:err.status|| "server error"})

    }
    logger.error(`Error in API ${req.originalUrl} - ${err.message}`)
    return res.status(500).json({message: err.message || "something went wrong" , status:err.status|| "server error"})
}

const nontfound = (req,res,next)=>{
    logger.warn(`check API url${req.originalUrl} `)
    return res.status( 404).json({message:  "route not found" , status: "failed"})
}
module.exports = {errorHandler,nontfound}