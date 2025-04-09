const express =  require("express")
const app = express()
const errorHandler = require("./utils/errorHandler")


app.use(express.json())
app.use(express.urlencoded({extended:true}))
const PORT = 5000
app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
})