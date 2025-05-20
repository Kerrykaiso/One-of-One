const axios = require('axios');
const crypto = require("crypto")
const AppError = require("../utils/appError")
const generatePaystackRefrence = require('../utils/generate');


const initiatePaymentService = async (paymentDetails,next) => {
    const { amount, email, designer_id, productId, address,designerEmail} = paymentDetails;

    try {
        const reference = generatePaystackRefrence()
        const metadata ={...paymentDetails,designer_id,type:"order",paymentRef:reference}

        const paystackParams = {
            amount: amount * 100, //Paystack requires the amount in kobo
            email: email,
            channels: ["card"],
            reference: reference,
            metadata
        };  

    const {data} = await axios.post(`https://api.paystack.co/transaction/initialize`, paystackParams, {
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
        },
    }) 
    if (data && data.status) {
        return data.data
    } else {
        const appErr = new AppError("failed to initiate payment", "failed", 400)
        throw appErr
    }
    } catch (error) {
        next(error)
    }
}




const fundWallet=async(details,next)=>{
    const {amount,email,designerId} = details
    try {
        const reference = generatePaystackRefrence()
        const metadata ={...details,type:"funding",reference}

        const paystackParams = {
            amount: amount * 100, //Paystack requires the amount in kobo
            email: email,
            channels: ["card"],
            reference: reference,
            metadata
        };

        
    const {data} = await axios.post(`https://api.paystack.co/transaction/initialize`, paystackParams, {
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
        },
    }) 
    if (data && data.status) {
        return data.data
    } else {
        const appErr = new AppError("failed to initiate payment", "failed", 400)
        throw appErr
    }
    } catch (error) {
        next(error)
    }
}


 const webhookSeviceService =async(data,req,next)=>{
    const secretKey = process.env.PAYSTACK_KEY
    const hash = crypto.createHmac("sha512",secretKey).update(JSON.stringify(data)).digest("hex")
    const info=data.metadata
 try {
  if (hash===req.headers["x-paystack-signature"]) {
      if (data.event === "charge.success") {
         return info
      } else {
        return true
      }
  } else{
    return false
  }
 } catch (error) {
    next(error)
 }
 }

module.exports = { initiatePaymentService,webhookSeviceService,fundWallet};