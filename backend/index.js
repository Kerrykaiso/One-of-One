const express = require("express")
const app = express()
require("dotenv").config()
const {errorHandler,nontfound} = require("./middlewares/error-middleware")
const customerAuth  = require("./routes/auth-route")
const designerAuth = require("./routes/designer-route")
const adminAuth = require("./routes/admin-route")
const passport = require("passport")
const submission = require("./routes/submit-design")
const verifyOTP = require("./routes/verify-otp-route")
const session = require("express-session")
const restock = require("./routes/stock-route")
const profile = require("./routes/profile-route")
const cors = require("cors")


const googleAuthCallback = require("./routes/google-auth-route")
const testing = require("./routes/testing")
require("./config/google-oauth")
const db = require("./models")
const { updateProductService } = require("./services/updateProduct-service")
const requestLogger = require("./middlewares/logger-middleware")
const { paymentProxy } = require("./config/proxy-config")
const PORT = 8000

app.use(session({
  secret: "secret",
  resave:false,
  saveUninitialized:true
}))
app.use(passport.initialize())
//app.use(passport.session())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(requestLogger)
app.use("/api", customerAuth)
app.use("/api", paymentProxy)
app.use("/api", restock)
app.use("/api", designerAuth)
app.use("/api", testing)
app.use("/api", adminAuth)
app.use("/api", submission)
app.use("/api", profile)
app.use("/api", verifyOTP)
app.use("/auth", googleAuthCallback)
app.use(nontfound)
app.use(errorHandler)


db.sequelize.sync({ alter:true }).then(() => {});
app.listen(PORT, async() => {
  try {
    await updateProductService()
    console.log(`server running on port ${PORT}`);

  } catch (error) {
    console.log(error)
  }
});