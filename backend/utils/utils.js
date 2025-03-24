const {body} = require("express-validator")

const registerUserBody = [body("name").isString().withMessage("Name must be texts").notEmpty()
  .withMessage("Provide a name"),
  body("email").isString().withMessage("Email must be in texts").notEmpty().withMessage("Provide a mail address"),
  body("password").notEmpty().withMessage("Please provide a password")

]



const registerDesignerBody = [body("name").isString().withMessage("Name must be texts").notEmpty()
  .withMessage("Provide a name"),
  body("email").isString().withMessage("Email must be in texts").notEmpty().withMessage("Provide a mail address"),
  body("password").notEmpty().withMessage("Please provide a password"),
  body("instagram").trim().isURL().withMessage("Input a valid URL").matches(/instagram\.com/).withMessage("Input a valid instagram link"),
  body("pinterest").trim().isURL().withMessage("Input a valid URL").matches(/pinterest\.com/).withMessage("Input a valid pinterest link"),
  body("X").trim().isURL().withMessage("Input a valid URL").matches(/X\.com/).withMessage("Input a valid X link")

]
const loginBody = [
  body("email").isString().withMessage("Email must be in texts").notEmpty().withMessage("Provide a mail address"),
  body("password").notEmpty().withMessage("Please provide a password")

]

const otp =[
  body("email").isString().withMessage("Email must be in texts").notEmpty().withMessage("Provide a mail address"),
  body("otp").isString().withMessage("This is not a valid otp").notEmpty().withMessage("Provide OTP sent to mail")
]

module.exports = {registerUserBody, loginBody,registerDesignerBody,otp}