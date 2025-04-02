const {Wallet}= require("../models")
const AppError = require("../utils/appError")


const createWalletService =async(id,email,next)=>{
 try {
    const createdWallet = await Wallet.create({designerId:id,email})

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