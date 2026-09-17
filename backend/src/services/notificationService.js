const { isWeekday } = require("../utils/billing");

async function generateMorningNotifications(prisma, dateValue) {
  const date = new Date(`${dateValue}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) throw new Error("Invalid date");

  // T1: weekends have no scheduled tiffin delivery.
  if (!isWeekday(date)) return [];

  const subscriptions = await prisma.subscription.findMany({
    where: { status: "ACTIVE" },
    include: { customer: true, pauses: true }
  });

  const eligible = subscriptions.filter(subscription => {
    const started = date >= new Date(subscription.startDate);
    const paused = subscription.pauses.some(
      p => date >= new Date(p.startDate) && date <= new Date(p.endDate)
    );
    return started && !paused;
  });

  const outbox = [];

  for (const subscription of eligible) {
    outbox.push(
      await prisma.notificationOutbox.create({
        data: {
          type: "DELIVERY_NOTIFICATION",
          customerId: subscription.customer.id,
          phone: subscription.customer.phone,
          date,
          message: "Your tiffin is scheduled for delivery today."
        }
      })
    );
  }

  return outbox;
}

module.exports = { generateMorningNotifications };
