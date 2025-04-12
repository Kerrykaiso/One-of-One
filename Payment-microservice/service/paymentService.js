const axios = require('axios');
const crypto = require("crypto")
const AppError = require("../utils/appError")
const generatePaystackRefrence = require('../utils/generate');
const { constants } = require('fs/promises');


const initiatePaymentService = async (paymentDetails,next) => {
    const { amount, email, designerId, productId, address,username,userEmail,userId } = paymentDetails;

    try {
        const reference = generatePaystackRefrence()
        const metadata ={...paymentDetails,reference}

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

 const webhookSeviceService =async(data,next)=>{
    const secretKey = process.env.PAYSTACK_KEY
    const hash = crypto.createHmac("sha512",secretKey).update(JSON.stringify(data)).digest("hex")
    const order=data.metadata
 try {
  if (hash===req.headers["x-paystack-signature"]) {
      if (data.event === "charge.success") {
         return order
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

module.exports = { initiatePaymentService,webhookSeviceService};