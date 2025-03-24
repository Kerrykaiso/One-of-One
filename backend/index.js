const express = require("express")
const app = express()
require("dotenv").config()
const errorHandler = require("./middlewares/error-middleware")
const customerAuth  = require("./routes/auth-route")
const designerAuth = require("./routes/designer-route")
const adminAuth = require("./routes/admin-route")
const passport = require("passport")
const submission = require("./routes/submit-design")
const verifyOTP = require("./routes/verify-otp-route")
const session = require("express-session")

const googleAuthCallback = require("./routes/google-auth-route")
const testing = require("./routes/testing")
require("./config/google-oauth")
const db = require("./models")
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

app.use("/api", customerAuth)
app.use("/api", designerAuth)
app.use("/api", testing)
app.use("/api", adminAuth)
app.use("/api", submission)
app.use("/api", verifyOTP)
app.use("/auth", googleAuthCallback)
app.use(errorHandler)


db.sequelize.sync({ alter:true }).then(() => {});
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});