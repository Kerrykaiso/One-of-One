const router = require("express").Router()
const { paymentController, fundWalletController } = require("../controller/paymentController")


router.post("/initiate-payment", paymentController)
router.post("/funding",fundWalletController)


module.exports = router