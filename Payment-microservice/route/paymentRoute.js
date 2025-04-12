const router = require("express").Router()
const { paymentController } = require("../controller/paymentController")


router.post("/initiate-payment", paymentController)


module.exports = router