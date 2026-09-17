const router = require("express").Router();
const controller = require("../controllers/notificationController");
router.get("/outbox", controller.outbox);
module.exports = router;
