const {
  generateMorningNotifications
} = require("../services/notificationService");

async function clock(req, res) {
  try {
    const date = req.body.date || new Date().toISOString().slice(0, 10);
    const outbox = await generateMorningNotifications(
      req.app.locals.prisma,
      date
    );

    res.json({
      date,
      notificationsCreated: outbox.length,
      outbox
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

module.exports = { clock };
