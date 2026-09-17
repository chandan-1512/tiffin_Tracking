const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  await prisma.notificationOutbox.deleteMany();
  await prisma.pause.deleteMany();
  await prisma.subscriptionAssignment.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.create({
    data: {
      name: "Tiffin Owner",
      email: "demo@tiffintrack.local",
      passwordHash: await bcrypt.hash("Demo@123", 10),
      role: "OWNER"
    }
  });

  const rahul = await prisma.customer.create({
    data: { name: "Rahul Sharma", phone: "9876543210" }
  });
  const priya = await prisma.customer.create({
    data: { name: "Priya Mehta", phone: "9988776655" }
  });
  const amit = await prisma.customer.create({
    data: { name: "Amit Verma", phone: "8765432109" }
  });

  const rahulUser = await prisma.user.create({
    data: {
      name: "Rahul Sharma",
      email: "rahul@tiffintrack.local",
      passwordHash: await bcrypt.hash("Rahul@123", 10),
      role: "CUSTOMER"
    }
  });
  await prisma.customer.update({
    where: { id: rahul.id },
    data: { userId: rahulUser.id }
  });

  const s1 = await prisma.subscription.create({
    data: {
      customerId: rahul.id,
      monthlyPrice: 3000,
      startDate: new Date("2026-09-01T00:00:00Z"),
      status: "ACTIVE"
    }
  });
  await prisma.pause.create({
    data: {
      subscriptionId: s1.id,
      startDate: new Date("2026-09-10T00:00:00Z"),
      endDate: new Date("2026-09-12T00:00:00Z")
    }
  });
  await prisma.subscriptionAssignment.create({
    data: {
      subscriptionId: s1.id,
      customerId: rahul.id,
      startDate: new Date("2026-09-01T00:00:00Z")
    }
  });

  const s2 = await prisma.subscription.create({
    data: {
      customerId: priya.id,
      monthlyPrice: 2500,
      startDate: new Date("2026-09-01T00:00:00Z"),
      status: "PAUSED"
    }
  });
  await prisma.pause.create({
    data: {
      subscriptionId: s2.id,
      startDate: new Date("2026-09-08T00:00:00Z"),
      endDate: new Date("2026-09-30T00:00:00Z")
    }
  });
  await prisma.subscriptionAssignment.create({
    data: {
      subscriptionId: s2.id,
      customerId: priya.id,
      startDate: new Date("2026-09-01T00:00:00Z")
    }
  });

  const s3 = await prisma.subscription.create({
    data: {
      customerId: amit.id,
      monthlyPrice: 2800,
      startDate: new Date("2026-09-01T00:00:00Z"),
      status: "ACTIVE"
    }
  });
  await prisma.subscriptionAssignment.create({
    data: {
      subscriptionId: s3.id,
      customerId: amit.id,
      startDate: new Date("2026-09-01T00:00:00Z")
    }
  });

  console.log("Seed complete.");
  console.log("Owner: demo@tiffintrack.local / Demo@123");
  console.log("Customer: rahul@tiffintrack.local / Rahul@123");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
