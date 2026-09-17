async function outbox(req, res) {
  const where = req.query.date
    ? { date: new Date(`${req.query.date}T00:00:00.000Z`) }
    : {};

  res.json(
    await req.app.locals.prisma.notificationOutbox.findMany({
      where,
      orderBy: { createdAt: "desc" }
    })
  );
}

module.exports = { outbox };
