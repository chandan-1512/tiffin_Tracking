const router = require("express").Router();
const controller = require("../controllers/billingController");
router.get("/", controller.monthly);
router.get("/customer/:id", controller.customerBill);
module.exports = router;
