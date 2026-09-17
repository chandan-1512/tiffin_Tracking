const { importCustomers } = require("../services/importService");

async function importCsv(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "CSV file is required" });
    }

    res.json(
      await importCustomers(
        req.app.locals.prisma,
        req.file.buffer.toString("utf8")
      )
    );
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

module.exports = { importCsv };
