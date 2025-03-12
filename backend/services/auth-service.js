const {Customer} = require("../models")
const {signJwt} = require("../middlewares/jwt")
const bcrypt = require("bcryptjs")
const AppError = require("../utils/appError")
const uuid = require("uuid")




const registerCustomerService = async(data,next )=>{
 try {
    const {name,password,email} = data
    const existingUser  = await Customer.findOne({where:{email:email}})
    if (existingUser) {
        const appError=  new AppError("User already exist", "failed", 400)
        throw appError
    }
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt)
      const id = uuid.v4()
      const saved = await Customer.create({ email: email, password: hashPassword, name,id});
      
      if (!saved) {
        return null
      }

      const userInfo = saved.toJSON()
      delete userInfo.password
      return userInfo
      
 } catch (error) {
       return next(error)        
 }
}


const loginCustomerService= async(data,next)=>{
 try {
    const {email, password}= data
    const findCustomer  = await Customer.findOne({where:{email}})
    if (!findCustomer) {
        const err = new AppError("Incorrect email or password", "failed", 401)
        throw err
    }
    const isCorrect = await bcrypt.compare(password,findCustomer.password)
    if (!isCorrect) {
        const err = new AppError("Incorrect email or password", "failed", 401) 
        throw err
    }
    const signdata ={email:findCustomer.email, role: findCustomer.role, name:findCustomer.name,id:findCustomer.id}
    const token = signJwt(signdata)
    const loggedIn = findCustomer.toJSON()
    delete loggedIn.password
   return {...loggedIn, jwt:token}

 } catch (error) {
    return next(error)
 }
}

module.exports = {registerCustomerService, loginCustomerService}