const {Admin} = require("../models")
const AppError = require("../utils/appError")

const createCeoService = async(data,next)=>{
  try {
    const{email,name,password} = data
    const findCeo = await Admin.findOne({where:{email, role:"Ceo"}})
    if (findCeo) {
        const err = new AppError("Ceo already exist", "failed", 400)
        throw err
    }

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

   const createCeo = await Admin.create({email, role:"Ceo", password:hashPassword,name})
   if (!createCeo) {
       return null
   }
   const ceoData = createCeo.toJSON()
   delete ceoData.password
   return ceoData
  } catch (error) {
     next(error)
  }
}

const createSalesPersonService = async(data,next)=>{
 try {
    const{email,name,password} = data
    const findSalesPerson= await Admin.findOne({where:{email, role:"sales"}})
    if (findSalesPerson) {
        const err = new AppError("sales person already exist", "failed", 400)
        throw err
    }

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

   const createSalesPerson = await Admin.create({email, role:"sales", password:hashPassword,name})
   if (!createSalesPerson) {
       return null
   }
   const salesPerson = createSalesPerson.toJSON()
   delete salesPerson.password
   return salesPerson
 } catch (error) {
     next(error)
 }   
}

const createManagerService = async(data,next)=>{
  try {
    const{email,name,password} = data
    const findSalesPerson= await Admin.findOne({where:{email, role:"manager"}})
    if (findSalesPerson) {
        const err = new AppError("sales person already exist", "failed", 400)
        throw err
    }
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    const createManager = await Admin.create({email, role:"Ceo", password:hashPassword,name})
    if (!createManager) {
        return null
    }
    const newManager = createManager.toJSON()
    delete newManager.password
    return newManager
  } catch (error) {
      next(error)
  }  
}



const loginAdminService=async(data,next)=>{
  try {
    const {email, password} = data
    const findAdmin = await Admin.findOne({where:{email}})
    if (!findAdmin) {
        const err = new AppError("Incorrect email or password", "failed", 400)
        throw err
    }
    const isCorrect = await bcrypt.compare(password,findAdmin.password)
    if (!isCorrect) {
        const err = new AppError("Incorrect email or password", "failed", 401) 
        throw err
    }
    const signdata ={email:findAdmin.email, role: findAdmin.role, name:findAdmin.name,id:findAdmin.id}
    const token = signJwt(signdata)
    
    const loginAdmin = findAdmin.toJSON()
    delete loginAdmin.password

    return {...loginAdmin,jwt:token}
  } catch (error) {
      next(error)
  }
}





module.exports={createManagerService,createSalesPersonService,createCeoService, loginAdminService}