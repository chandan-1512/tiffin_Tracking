async function dashboard(req, res) {
  const prisma = req.app.locals.prisma;

  const [totalCustomers, activeCustomers, pausedCustomers] =
    await Promise.all([
      prisma.customer.count(),
      prisma.subscription.count({ where: { status: "ACTIVE" } }),
      prisma.subscription.count({ where: { status: "PAUSED" } })
    ]);

  res.json({ totalCustomers, activeCustomers, pausedCustomers });
}

module.exports = { dashboard };
