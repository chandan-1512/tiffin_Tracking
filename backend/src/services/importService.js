const { parseDateOnly } = require("../utils/billing");

function normalizePhone(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  return digits;
}

function normalizeDate(value) {
  const raw = String(value || "").trim();
  if (!raw) return null;

  let match = raw.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (match) {
    return `${match[1]}-${match[2].padStart(2, "0")}-${match[3].padStart(2, "0")}`;
  }

  match = raw.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (match) {
    return `${match[3]}-${match[2].padStart(2, "0")}-${match[1].padStart(2, "0")}`;
  }

  return null;
}

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];

  const headers = lines.shift().split(",").map(x => x.trim());

  return lines.map((line, index) => {
    const columns = line.split(",");
    const row = {};

    headers.forEach((header, i) => {
      row[header] = (columns[i] || "").trim();
    });

    row.__row = index + 2;
    return row;
  });
}

async function importCustomers(prisma, text) {
  const rows = parseCsv(text);
  const result = {
    imported: 0,
    deduped: 0,
    rejected: 0,
    errors: []
  };

  const seenPhones = new Set();

  for (const row of rows) {
    const name = String(row.name || "").trim();
    const phone = normalizePhone(row.phone);
    const startDate = normalizeDate(row.startDate);
    const monthlyPrice = Number(row.monthlyPrice);

    if (
      !name ||
      phone.length < 10 ||
      !startDate ||
      !Number.isFinite(monthlyPrice) ||
      monthlyPrice <= 0
    ) {
      result.rejected++;
      result.errors.push({
        row: row.__row,
        reason: "Missing/invalid name, phone, startDate, or monthlyPrice"
      });
      continue;
    }

    if (
      seenPhones.has(phone) ||
      await prisma.customer.findUnique({ where: { phone } })
    ) {
      result.deduped++;
      continue;
    }

    try {
      const customer = await prisma.customer.create({
        data: { name, phone }
      });

      const subscription = await prisma.subscription.create({
        data: {
          customerId: customer.id,
          monthlyPrice,
          startDate: parseDateOnly(startDate),
          status: "ACTIVE"
        }
      });

      await prisma.subscriptionAssignment.create({
        data: {
          subscriptionId: subscription.id,
          customerId: customer.id,
          startDate: parseDateOnly(startDate)
        }
      });

      seenPhones.add(phone);
      result.imported++;
    } catch (error) {
      result.rejected++;
      result.errors.push({
        row: row.__row,
        reason: error.message
      });
    }
  }

  return result;
}

module.exports = {
  normalizePhone,
  normalizeDate,
  parseCsv,
  importCustomers
};
