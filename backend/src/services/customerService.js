async function listCustomers(prisma, {
  search = "",
  page = 1,
  limit = 10,
  sort = "name",
  order = "asc"
}) {
  const allowedSorts = { name: "name", phone: "phone", createdAt: "createdAt" };
  const sortField = allowedSorts[sort] || "name";
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 10));

  const where = search
    ? { OR: [{ name: { contains: search } }, { phone: { contains: search } }] }
    : {};

  const [items, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      orderBy: { [sortField]: order === "desc" ? "desc" : "asc" },
      skip: (safePage - 1) * safeLimit,
      take: safeLimit,
      include: {
        subscriptions: {
          orderBy: { createdAt: "desc" },
          take: 1
        }
      }
    }),
    prisma.customer.count({ where })
  ]);

  return {
    items,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      pages: Math.ceil(total / safeLimit)
    }
  };
}

async function getCustomer(prisma, id) {
  return prisma.customer.findUnique({
    where: { id: Number(id) },
    include: {
      subscriptions: {
        orderBy: { createdAt: "desc" },
        include: {
          pauses: true,
          assignments: {
            include: { customer: true },
            orderBy: { startDate: "asc" }
          }
        }
      }
    }
  });
}

async function createCustomer(prisma, data) {
  return prisma.customer.create({ data });
}

module.exports = { listCustomers, getCustomer, createCustomer };
