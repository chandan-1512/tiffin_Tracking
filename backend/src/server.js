require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const { auth, requireRole } = require("./middleware/auth");

const app = express();
const prisma = new PrismaClient();

app.locals.prisma = prisma;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ name: "TiffinTrack API", status: "running" });
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", require("./routes/authRoutes"));

app.use(
  "/api/dashboard",
  auth,
  requireRole("OWNER"),
  require("./routes/dashboardRoutes")
);

app.use(
  "/api/customers",
  auth,
  requireRole("OWNER"),
  require("./routes/customerRoutes")
);

app.use(
  "/api/subscriptions",
  auth,
  requireRole("OWNER"),
  require("./routes/subscriptionRoutes")
);

app.use(
  "/api/billing",
  auth,
  requireRole("OWNER"),
  require("./routes/billingRoutes")
);

app.use(
  "/api/clock",
  auth,
  requireRole("OWNER"),
  require("./routes/clockRoutes")
);

app.use(
  "/api/notifications",
  auth,
  requireRole("OWNER"),
  require("./routes/notificationRoutes")
);

app.use(
  "/api/import",
  auth,
  requireRole("OWNER"),
  require("./routes/importRoutes")
);

app.get("/api/me", auth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { customer: true }
  });

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    customerId: user.customer?.id || null
  });
});

app.get(
  "/api/my-account",
  auth,
  requireRole("CUSTOMER"),
  async (req, res) => {
    const customer = await prisma.customer.findUnique({
      where: { id: req.user.customerId },
      include: {
        subscriptions: {
          include: {
            pauses: true,
            assignments: {
              include: { customer: true },
              orderBy: { startDate: "asc" }
            }
          },
          orderBy: { createdAt: "desc" },
          take: 1
        }
      }
    });

    if (!customer) {
      return res.status(404).json({ error: "Customer account not linked" });
    }

    res.json(customer);
  }
);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`TiffinTrack API running on port ${port}`);
});
