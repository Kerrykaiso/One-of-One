const generateOTP=()=>{
    const otp = Math.floor(100000 + Math.random()*900000)
    return otp.toString()
}

const escapeHtml=(html)=>{
    return html.replace(/[&<>"']/g,'')
  }
module.exports={generateOTP,escapeHtml}