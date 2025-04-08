const express = require("express")
const errorHandler = require("./utils/errorHandler")
const app = express()
require("dotenv").config()

app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.use(errorHandler)
const PORT = 5000
app.listen(PORT,()=>{
    console.log(`server running on port ${ PORT}`)
})