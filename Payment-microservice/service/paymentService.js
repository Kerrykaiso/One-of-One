const axios = require('axios');
const AppError = require("../utils/appError")
const generatePaystackRefrence = require('../utils/generate');


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
        return data.data.authorization_url
    } else {
        const appErr = new AppError("failed to initiate payment", "failed", 400)
        throw appErr
    }
    } catch (error) {
        next(error)
    }
}

 const webhookSeviceService =()=>{

 }

module.exports = { initiatePaymentService};