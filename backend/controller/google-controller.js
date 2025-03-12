const AppError = require("../utils/appError")
const passport = require("passport")

const googleAuth = async(req,res,next)=>{
   try {
    if (!req.user) {
        const appErr = new AppError("Google authentication failed", "failed", 401)
        throw appErr
    }
     res.status(200).json({data:req.user.user, token: req.user.token})
   } catch (error) {
      next(error)
   }
}

const instantiateGoogle = (req,res,next)=>{
 const {role} = req.query
 if (!role || !["designer","customer"].includes(role)) {
    return res.status(400).json("No role provided")
 }
 passport.authenticate("google",{scope:["profile", "email"], state:role})(req,res,next)

}

module.exports = {googleAuth,instantiateGoogle}