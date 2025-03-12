const express = require("express")
const app = express()
require("dotenv").config()
const errorHandler = require("./middlewares/error-middleware")
const customerAuth  = require("./routes/auth-route")
const designerAuth = require("./routes/designer-route")
const adminAuth = require("./routes/admin-route")
const passport = require("passport")
const googleAuthCallback = require("./routes/google-auth-route")
const db = require("./models")
const PORT = 8000


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use("/api", customerAuth)
app.use("/api", designerAuth)
app.use("/api", adminAuth)
app.use(passport.initialize())
app.use("/auth", googleAuthCallback)
app.use(errorHandler)


db.sequelize.sync({ alter: true }).then(() => {});
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});