const {createProxyMiddleware} = require("http-proxy-middleware")
const logger = require("../config/logger")

const onProxyError =(err,req,res)=>{
    logger.error(`Error in ${req.originalUrl}-payment service unavailable`)
    if (!res.headersSent) {
        return res.status(503).json({message:"payment service unavailable",status:"failed"})

    }
}


const paymentProxy  =createProxyMiddleware({
    target:"http://localhost:5000",
    changeOrigin:true,
    pathRewrite:{"^/api/payment":"/payment"},
    timeout: 5000,
    on:{
        error:onProxyError
    }
})



module.exports ={paymentProxy}