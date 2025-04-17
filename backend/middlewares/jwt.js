const jwt = require("jsonwebtoken")
const {Customer,Admin,Designer} = require("../models")
const AppError = require("../utils/appError")

const signJwt = (tokenData) =>{
  return jwt.sign({email: tokenData.email, role: tokenData.role, name: tokenData.name,id:tokenData.id},
    process.env.ONEOFONE_TOKEN, {expiresIn: "2d"})
}

const checkToken=(req,res,next)=>{
  const authHeader = req.headers.authorization

  if (authHeader) {
      const token=authHeader.split(" ")[1]

      jwt.verify(token, process.env.ONEOFONE_TOKEN, (err,user)=>{
          if(err){
             return  res.status(400).json(err.message)
          }
          req.data=user
         next()

      })
  }else {
      res.status(400).json("invalid or missing token")
  }
}   

const designerAuth=async(req, res, next)=>{
   try {
    checkToken (req, res,async()=>{
      const findDesigner = await Designer.findOne({where:{id:req.data.id}})
      if (findDesigner) {
          next()
      }
      else{
        throw new AppError("You are not authorized for this","failed",403)
      }
    })
   } catch (error) {
      next(error)
   }
}

const customerAuth=(req, res, next)=>{
  try {
    checkToken(req, res,async()=>{
      const findCustomer = await Customer.findOne({where:{id:req.data.id}})
  
      if (findCustomer) {
          next()
      }
      else{
        throw new AppError("You are not authorized for this","failed",403)
      }
    })
  } catch (error) {
     next(error)
  }
}

const adminAuth=(roles=[])=>(req, res, next)=>{
 try {
  checkToken(req, res,async()=>{
    const findAdmin = await Admin.findOne({where:{id:req.data.id}})
    if (!findAdmin) {
        throw new AppError("Admin not found", "failed", 401)
    }
   else if (!roles.includes(findAdmin.role)) {
        throw new AppError("You are not authorized for this", "failed", 401)

    }
    else{
      next()    
    }
  })
 } catch (error) {
   next(error)
 }
}

module.exports = {signJwt, customerAuth, designerAuth, adminAuth}