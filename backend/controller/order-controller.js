const { getAllOrderService, getOrderByIdService } = require("../services/order-service")
const AppError = require("../utils/appError")
const { escapeHtml } = require("../utils/emailUtils")



const allOrderController =async(req,res,next)=>{
    try {
        const allOrders = await getAllOrderService(next)
        if (!allOrders) {
            const err = AppError("Something went wrong while fetching orders","failed",400)
            throw err
        }
        res.status(200).json(allOrders)
    } catch (error) {
        next(error)
    }
}


const orderIdController = async(req,res,next)=>{
    const id = req.params.id
    try {
        const orderDetail = await getOrderByIdService(escapeHtml(id),next)
        if (!orderDetail) {
            const err = AppError("Something went wrong while fetching order","failed",400)
            throw err 
        }
    res.status(200).json(orderDetail)
    } catch (error) {
       next(error) 
    }
}

module.exports ={allOrderController,orderIdController}