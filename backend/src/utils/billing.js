function parseDateOnly(value) {
  const d = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(d.getTime())) throw new Error(`Invalid date: ${value}`);
  return d;
}

function isWeekday(d) {
  const day = d.getUTCDay();
  return day >= 1 && day <= 5;
}

function eachDate(start, end) {
  const result = [];
  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    result.push(new Date(d));
  }
  return result;
}

function monthBounds(month) {
  if (!/^\d{4}-\d{2}$/.test(month)) throw new Error("month must be YYYY-MM");
  const [year, monthNumber] = month.split("-").map(Number);
  if (monthNumber < 1 || monthNumber > 12) throw new Error("Invalid month");
  return {
    start: new Date(Date.UTC(year, monthNumber - 1, 1)),
    end: new Date(Date.UTC(year, monthNumber, 0))
  };
}

function isPaused(date, pauses) {
  return pauses.some(
    p => date >= new Date(p.startDate) && date <= new Date(p.endDate)
  );
}

function calculateBill({ monthlyPrice, month, subscriptionStartDate, pauses = [] }) {
  const { start: monthStart, end: monthEnd } = monthBounds(month);
  const totalWeekdays = eachDate(monthStart, monthEnd).filter(isWeekday).length;

  const serviceStart = new Date(
    Math.max(monthStart.getTime(), new Date(subscriptionStartDate).getTime())
  );

  const applicable = serviceStart <= monthEnd
    ? eachDate(serviceStart, monthEnd).filter(isWeekday)
    : [];

  const paused = applicable.filter(d => isPaused(d, pauses));
  const served = applicable.filter(d => !isPaused(d, pauses));

  return {
    monthlyPrice,
    totalWeekdays,
    applicableWeekdays: applicable.length,
    pausedWeekdays: paused.length,
    servedDays: served.length,
    bill: Number(
      (monthlyPrice * served.length / (totalWeekdays || 1)).toFixed(2)
    ),
    servedDates: served.map(d => d.toISOString().slice(0, 10))
  };
}

function calculateAssignmentBill({
  monthlyPrice,
  month,
  subscriptionStartDate,
  assignmentStartDate,
  assignmentEndDate,
  pauses = []
}) {
  const { start: monthStart, end: monthEnd } = monthBounds(month);

  const lower = new Date(Math.max(
    monthStart.getTime(),
    new Date(subscriptionStartDate).getTime(),
    new Date(assignmentStartDate).getTime()
  ));

  const upper = new Date(Math.min(
    monthEnd.getTime(),
    assignmentEndDate
      ? new Date(assignmentEndDate).getTime()
      : monthEnd.getTime()
  ));

  if (lower > upper) {
    return {
      applicableWeekdays: 0,
      pausedWeekdays: 0,
      servedDays: 0,
      bill: 0,
      servedDates: []
    };
  }

  const totalWeekdays = eachDate(monthStart, monthEnd).filter(isWeekday).length || 1;
  const applicable = eachDate(lower, upper).filter(isWeekday);
  const paused = applicable.filter(d => isPaused(d, pauses));
  const served = applicable.filter(d => !isPaused(d, pauses));

  return {
    applicableWeekdays: applicable.length,
    pausedWeekdays: paused.length,
    servedDays: served.length,
    bill: Number((monthlyPrice * served.length / totalWeekdays).toFixed(2)),
    servedDates: served.map(d => d.toISOString().slice(0, 10))
  };
}

module.exports = {
  parseDateOnly,
  isWeekday,
  monthBounds,
  calculateBill,
  calculateAssignmentBill
};
