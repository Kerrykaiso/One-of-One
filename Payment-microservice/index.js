const express =  require("express")
const app = express()
const errorHandler = require("./utils/errorHandler")
const paymentRoute = require("./route/paymentRoute")
const fundWalletRoute = require("./route/fundwalletRoute")

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/payment",paymentRoute)
app.use("/fund-wallet",paymentRoute)

app.use(errorHandler)
app.use(errorHandler)
const PORT = 5000
app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
})