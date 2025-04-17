const {Wallet}= require("../models")
const AppError = require("../utils/appError")
const db = require("../models/index")


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


const fundWalletService = async(designerId,amount,next)=>{
   const transaction =await db.sequelize.transaction()
   
 try {
   const findDesignerWallet = await Wallet.findOne({where:{designerId}})

   if (!findDesignerWallet) {
      const appErr = new AppError("Error finding wallet", "failed", 400)
        throw appErr
   }
   const creditAmount = parseInt(amount)
   const updateAmount=  await findDesignerWallet.increment("balance",{by:creditAmount,transaction})
   const  newValue = updateAmount.get({plain:true})
   

   if (!newValue) {
      const appErr = new AppError("Error funding wallet", "failed", 400)
       throw appErr
   }

 } catch (error) {
   next(error)
 }
}

const checkWalletBalance=async(designerId,next)=>{
  try {
   const findDesignerWallet = await Wallet.findOne({where:{designerId},raw:true})

   if (!findDesignerWallet) {
      const appErr = new AppError("Error finding wallet", "failed", 400)
      throw appErr
   }
   if (findDesignerWallet.balance < 10000) {
       return false
   }
   return true
  } catch (error) {
     next(error)
  }
}
module.exports ={createWalletService,checkWalletBalance}