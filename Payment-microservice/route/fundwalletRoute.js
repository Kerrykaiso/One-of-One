const router = require("express").Router()
const {  fundWalletController } = require("../controller/paymentController")


router.post("/funding",fundWalletController)


module.exports = router