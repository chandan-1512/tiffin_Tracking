const service = require("../services/customerService");

async function list(req, res) {
  try {
    res.json(await service.listCustomers(req.app.locals.prisma, req.query));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

async function get(req, res) {
  try {
    const customer = await service.getCustomer(req.app.locals.prisma, req.params.id);

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json(customer);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

async function create(req, res) {
  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: "name and phone are required" });
    }

    res.status(201).json(
      await service.createCustomer(req.app.locals.prisma, { name, phone })
    );
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

module.exports = { list, get, create };
