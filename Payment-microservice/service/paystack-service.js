const axios = require("axios")
const { generatePaystackRefrence } = require("../utils/generate")

const initiatePaymentService =async(data,next)=>{
    const {owner,poductId,location,number,designerId,email,amount} = data
  try {
    const refrence = generatePaystackRefrence()
    const metadata = {...data, refrence}
    const pastackParams ={
        email,
        amount: amount * 100,
        refrence,
        metadata
    }
    const config = {
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
        }
    };
    const {data} = await axios.post("https://api.paystack.co/transaction/initialize", pastackParams, config)
    if(data && data.status){
        return data.data.authorization_url
  } else{
        return false
  }
  } catch (error) {
    next(error)
  }
}
