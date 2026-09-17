const router = require("express").Router();
const controller = require("../controllers/clockController");
router.post("/", controller.clock);
module.exports = router;
