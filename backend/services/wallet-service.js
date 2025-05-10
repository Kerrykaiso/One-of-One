const {Wallet}= require("../models")
const {constants} =require("../utils/constants")
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


const fundWalletService = async(designerId,amount,)=>{
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
    await transaction.commit()
 } catch (error) {
   await transaction.rollback()
   const appErr = new AppError(error.message, "failed", 400)
   throw appErr
 }
}

const checkWalletBalance=async(designerId,next)=>{
  try {
   const findDesignerWallet = await Wallet.findOne({where:{designerId},raw:true})

   if (!findDesignerWallet) {
      const appErr = new AppError("Error finding wallet", "failed", 400)
      throw appErr
   }
   if (findDesignerWallet.balance < constants.PRICE_OF_BLANKS) {
       return false
   }
   return true
  } catch (error) {
     next(error)
  }
}


const debitWallet =async(designerId,next)=>{
   const transaction = await db.sequelize.transaction()
 try {
   const findDesignerWallet = await Wallet.findOne({where:{designerId}})
   
   if (!findDesignerWallet) {
      const appErr = new AppError("Error finding wallet", "failed", 400)
        throw appErr
   }
   const updateAmount=  await findDesignerWallet.decrement("balance",{by:constants.PRICE_OF_BLANKS,transaction})
   const  newValue = updateAmount.get({plain:true})
   if (!newValue) {
      const appErr = new AppError("Error funding wallet", "failed", 400)
       throw appErr
   }
   await transaction.commit()
   return true
 } catch (error) {
   transaction.rollback()
   next(error)
 }
}
module.exports ={createWalletService,checkWalletBalance,fundWalletService,debitWallet}