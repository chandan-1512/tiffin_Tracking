const service = require("../services/subscriptionService");

async function subscribe(req, res) {
  try {
    res.status(201).json(
      await service.subscribe(
        req.app.locals.prisma,
        Number(req.params.id),
        req.body
      )
    );
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

async function pause(req, res) {
  try {
    res.json(
      await service.pause(
        req.app.locals.prisma,
        Number(req.params.id),
        req.body
      )
    );
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

async function resume(req, res) {
  try {
    res.json(
      await service.resume(req.app.locals.prisma, Number(req.params.id))
    );
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

async function transfer(req, res) {
  try {
    res.json(
      await service.transfer(
        req.app.locals.prisma,
        Number(req.params.id),
        req.body
      )
    );
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

module.exports = { subscribe, pause, resume, transfer };
