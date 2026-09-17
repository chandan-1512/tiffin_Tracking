const service = require("../services/billingService");

async function customerBill(req, res) {
  try {
    if (!req.query.month) throw new Error("month=YYYY-MM is required");

    res.json(
      await service.customerBill(
        req.app.locals.prisma,
        Number(req.params.id),
        req.query.month
      )
    );
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

async function monthly(req, res) {
  try {
    if (!req.query.month) throw new Error("month=YYYY-MM is required");
    res.json(await service.monthlyBilling(req.app.locals.prisma, req.query.month));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

module.exports = { customerBill, monthly };
