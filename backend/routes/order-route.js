const { allOrderController, orderIdController } = require("../controller/order-controller")

const router = require("express").Router()


router.get("/getAllOrders",allOrderController)
router.get("/order/:id", orderIdController)


module.exports = router