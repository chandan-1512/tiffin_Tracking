const router = require("express").Router();
const multer = require("multer");
const controller = require("../controllers/importController");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }
});

router.post("/customers", upload.single("file"), controller.importCsv);
module.exports = router;
