const router = require("express").Router();
const controller = require("../controllers/subscriptionController");
router.post("/:id/pause", controller.pause);
router.post("/:id/resume", controller.resume);
router.post("/:id/transfer", controller.transfer);
module.exports = router;
