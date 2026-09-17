const router = require("express").Router();
const customer = require("../controllers/customerController");
const subscription = require("../controllers/subscriptionController");
router.get("/", customer.list);
router.post("/", customer.create);
router.get("/:id", customer.get);
router.post("/:id/subscribe", subscription.subscribe);
module.exports = router;
