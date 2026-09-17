const { parseDateOnly } = require("../utils/billing");

async function subscribe(prisma, customerId, { monthlyPrice, startDate }) {
  const existing = await prisma.subscription.findFirst({
    where: {
      customerId,
      status: { in: ["ACTIVE", "PAUSED"] }
    }
  });

  if (existing) throw new Error("Customer already has an active subscription");

  const subscription = await prisma.subscription.create({
    data: {
      customerId,
      monthlyPrice: Number(monthlyPrice),
      startDate: parseDateOnly(startDate),
      status: "ACTIVE"
    }
  });

  await prisma.subscriptionAssignment.create({
    data: {
      subscriptionId: subscription.id,
      customerId,
      startDate: parseDateOnly(startDate)
    }
  });

  return subscription;
}

async function pause(prisma, subscriptionId, { startDate, endDate }) {
  const sub = await prisma.subscription.findUnique({
    where: { id: Number(subscriptionId) },
    include: { pauses: true }
  });

  if (!sub) throw new Error("Subscription not found");
  if (sub.status !== "ACTIVE") throw new Error("Only ACTIVE subscriptions can be paused");

  const start = parseDateOnly(startDate);
  const end = parseDateOnly(endDate);

  if (start > end) throw new Error("startDate must be before or equal to endDate");

  const overlap = sub.pauses.some(
    p => start <= new Date(p.endDate) && end >= new Date(p.startDate)
  );

  if (overlap) throw new Error("Pause range overlaps an existing pause");

  await prisma.pause.create({
    data: {
      subscriptionId: sub.id,
      startDate: start,
      endDate: end
    }
  });

  return prisma.subscription.update({
    where: { id: sub.id },
    data: { status: "PAUSED" }
  });
}

async function resume(prisma, subscriptionId) {
  const sub = await prisma.subscription.findUnique({
    where: { id: Number(subscriptionId) }
  });

  if (!sub) throw new Error("Subscription not found");
  if (sub.status !== "PAUSED") throw new Error("Only PAUSED subscriptions can be resumed");

  return prisma.subscription.update({
    where: { id: sub.id },
    data: { status: "ACTIVE" }
  });
}

async function transfer(prisma, subscriptionId, { newCustomerId, transferDate }) {
  const sub = await prisma.subscription.findUnique({
    where: { id: Number(subscriptionId) },
    include: {
      assignments: { orderBy: { startDate: "asc" } }
    }
  });

  if (!sub) throw new Error("Subscription not found");

  const newCustomer = await prisma.customer.findUnique({
    where: { id: Number(newCustomerId) }
  });

  if (!newCustomer) throw new Error("New customer not found");

  const date = parseDateOnly(transferDate);

  if (date <= new Date(sub.startDate)) {
    throw new Error("Transfer date must be after subscription start date");
  }

  const current = sub.assignments[sub.assignments.length - 1];

  if (current && current.customerId === newCustomer.id) {
    throw new Error("Subscription is already assigned to this customer");
  }

  if (current) {
    await prisma.subscriptionAssignment.update({
      where: { id: current.id },
      data: {
        endDate: new Date(date.getTime() - 86400000)
      }
    });
  }

  const assignment = await prisma.subscriptionAssignment.create({
    data: {
      subscriptionId: sub.id,
      customerId: newCustomer.id,
      startDate: date
    }
  });

  // Keep the subscription's plan and original cycle; only current owner changes.
  await prisma.subscription.update({
    where: { id: sub.id },
    data: { customerId: newCustomer.id }
  });

  return assignment;
}

module.exports = { subscribe, pause, resume, transfer };
