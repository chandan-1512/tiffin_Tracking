const {
  calculateBill,
  calculateAssignmentBill
} = require("../utils/billing");

async function customerBill(prisma, customerId, month) {
  const customer = await prisma.customer.findUnique({
    where: { id: Number(customerId) },
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

  if (!customer || !customer.subscriptions[0]) {
    throw new Error("Subscription not found");
  }

  const subscription = customer.subscriptions[0];

  // If this customer owns only part of the cycle, calculate only their assignment interval.
  const assignment = subscription.assignments.find(
    a => a.customerId === customer.id
  );

  const bill = assignment
    ? calculateAssignmentBill({
        monthlyPrice: subscription.monthlyPrice,
        month,
        subscriptionStartDate: subscription.startDate,
        assignmentStartDate: assignment.startDate,
        assignmentEndDate: assignment.endDate,
        pauses: subscription.pauses
      })
    : calculateBill({
        monthlyPrice: subscription.monthlyPrice,
        month,
        subscriptionStartDate: subscription.startDate,
        pauses: subscription.pauses
      });

  return { customer, subscription, bill };
}

async function monthlyBilling(prisma, month) {
  const subscriptions = await prisma.subscription.findMany({
    include: {
      customer: true,
      pauses: true,
      assignments: {
        include: { customer: true },
        orderBy: { startDate: "asc" }
      }
    }
  });

  return subscriptions.map(subscription => {
    const customers = subscription.assignments.map(assignment => ({
      customerId: assignment.customerId,
      customerName: assignment.customer.name,
      ...calculateAssignmentBill({
        monthlyPrice: subscription.monthlyPrice,
        month,
        subscriptionStartDate: subscription.startDate,
        assignmentStartDate: assignment.startDate,
        assignmentEndDate: assignment.endDate,
        pauses: subscription.pauses
      })
    }));

    return {
      subscriptionId: subscription.id,
      plan: subscription.monthlyPrice,
      status: subscription.status,
      customers,
      totalBill: Number(
        customers.reduce((sum, item) => sum + item.bill, 0).toFixed(2)
      )
    };
  });
}

module.exports = { customerBill, monthlyBilling };
