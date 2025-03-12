const {Designer} = require("../models")
const AppError = require("../utils/appError")
const bcrypt = require("bcryptjs")
const uuid = require("uuid")
const {signJwt} = require("../middlewares/jwt")


const registerDesignerService = async(data,next )=>{
    try {
       const {name,password,email,X, pinterest, instagram} = data
       const existingUser  = await Designer.findOne({where:{email:email}})
       if (existingUser) {
           const appError=  new AppError("User already exist", "failed", 400)
           throw appError
       }
         const salt = await bcrypt.genSalt(10);
         const hashPassword = await bcrypt.hash(password, salt)
         const id = uuid.v4()
         const saved = await Designer.create({ email: email, password: hashPassword, name,X,pinterest,instagram,id},);
         if (!saved) {
           return null
         }
         const designerInfo = saved.toJSON()
         delete designerInfo.password
         return designerInfo

    } catch (error) {
          return next(error)        
    }
   }

   
   const loginDesignerService= async(data,next)=>{
    try {
       const {email, password}= data
       const findDesigner  = await Designer.findOne({where:{email}})
       if (!findDesigner) {
           const err = new AppError("Incorrect email or password", "failed", 401)
           err.statusCode = 400
           throw err
       }
       const isCorrect = await bcrypt.compare(password,findDesigner.password)
       if (!isCorrect) {
           const err = new AppError("Incorrect email or password", "failed", 401) 
           err.statusCode = 400
           throw err
       }
       const signdata ={email:findDesigner.email, role: findDesigner.role, name:findDesigner.name,id:findDesigner.id}
       const token = signJwt(signdata)
       const loggedIn = findDesigner.toJSON()
       delete loggedIn.password
      return {...loggedIn, jwt:token}
   
    } catch (error) {
       return next(error)
    }
   }
   

   module.exports = {registerDesignerService,loginDesignerService}