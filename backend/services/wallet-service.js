const {Wallet}= require("../models")
const AppError = require("../utils/appError")


const createWalletService =async(id,next)=>{
 try {
    const createdWallet = await Wallet.create({designerId:id})

    if (!createdWallet) {
        const appErr = new AppError("Error creating wallet", "failed", 400)
        throw appErr
    }
    return createdWallet
 } catch (error) {
    return next(error)
 }
}

module.exports ={createWalletService}