const { z } = require("zod");
const service = require("../services/authService");

async function register(req, res) {
  try {
    const body = z.object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(6),
      role: z.enum(["OWNER", "CUSTOMER"]).optional()
    }).parse(req.body);

    const user = await service.register(req.app.locals.prisma, body);

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

async function login(req, res) {
  try {
    const body = z.object({
      email: z.string().email(),
      password: z.string()
    }).parse(req.body);

    res.json(await service.login(req.app.locals.prisma, body));
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
}

module.exports = { register, login };
