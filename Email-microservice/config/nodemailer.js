const nodemailer = require("nodemailer")

const sendMail =async(to,content)=>{
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth:{
               user:"",
               pass:""
            }
        })
        const mailOptions ={
          from:"",
          to:"",
          subject:"",
          text:""
        }
        const info = await transporter.sendMail(mailOptions)
        console.log("Email sent", info.response)
        return {success:true, message: "Email sent succesfully"}
    } catch (error) {
        console.log(error)
    }
}



module.exports ={sendMail}