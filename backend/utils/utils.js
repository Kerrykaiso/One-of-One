const {body} = require("express-validator")

const registerUserBody = [body("name").isString().withMessage("Name must be texts").notEmpty()
  .withMessage("Provide a name"),
  body("email").isString().withMessage("Email must be in texts").notEmpty().withMessage("Provide a mail address").isEmail().withMessage("Provide a valid email"),
  body("password").notEmpty().withMessage("Please provide a password")

]



const registerDesignerBody = [body("name").isString().withMessage("Name must be texts").notEmpty()
  .withMessage("Provide a name"),
  body("email").isString().withMessage("Email must be in texts").notEmpty().withMessage("Provide a mail address").isEmail().withMessage("Provide a valid email"),
  body("password").notEmpty().withMessage("Please provide a password"),
  body("instagram").trim().isURL().withMessage("Input a valid URL").matches(/instagram\.com/).withMessage("Input a valid instagram link"),
  body("pinterest").trim().isURL().withMessage("Input a valid URL").matches(/pinterest\.com/).withMessage("Input a valid pinterest link"),
  body("X").trim().isURL().withMessage("Input a valid URL").matches(/X\.com/).withMessage("Input a valid X link")

]
const loginBody = [
  body("email").isString().withMessage("Email must be in texts").notEmpty().withMessage("Provide a mail address").isEmail().withMessage("Provide a valid email"),
  body("password").notEmpty().withMessage("Please provide a password")

]

const otp =[
  body("email").isString().withMessage("Email must be in texts").notEmpty().withMessage("Provide a mail address").isEmail().withMessage("Provide a valid email"),
  body("otp").isString().withMessage("This is not a valid otp").notEmpty().withMessage("Provide OTP sent to mail").isLength({min:5,max:8}).withMessage("OTP must be 6 digits").isNumeric().withMessage("OTP must be in digits"),
]
const stockBody =[
  body("color").isString().withMessage("Color must be in texts").notEmpty().withMessage("Provide a color"),
  body("number").isNumeric().withMessage("Number must be in digits").notEmpty().withMessage("Provide a number"),
  body("material").isString().withMessage("Material must be in texts").notEmpty().withMessage("Provide a material"),
]
const editProfile = [
  body("name").optional().isString().withMessage("please use letters"),
  body("X").optional().isString().withMessage("url must be a string").trim().isURL().withMessage("Input a valid URL").matches(/X\.com/).withMessage("Input a valid X link"),
  body("pinterest").optional().isString().withMessage("url must be a string").trim().isURL().withMessage("Input a valid URL").matches(/pinterest\.com/).withMessage("Input a valid pinterest link"),
  body("instagram").optional().isString().withMessage("url must be a string").trim().isURL().withMessage("Input a valid URL").matches(/instagram\.com/).withMessage("Input a valid instagram link"),
  body("email").optional().isString().withMessage("email must be a string").isEmail().withMessage("Provide a valid email"),
  
]
module.exports = {registerUserBody, loginBody,registerDesignerBody,otp,stockBody,editProfile}