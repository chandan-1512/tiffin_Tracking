const test = require("node:test");
const assert = require("node:assert/strict");
const {
  calculateBill,
  calculateAssignmentBill
} = require("../src/utils/billing");

test("September 2026 has 22 weekdays", () => {
  const result = calculateBill({
    monthlyPrice: 3000,
    month: "2026-09",
    subscriptionStartDate: "2026-09-01"
  });
  assert.equal(result.totalWeekdays, 22);
  assert.equal(result.servedDays, 22);
  assert.equal(result.bill, 3000);
});

test("pause removes only weekdays", () => {
  const result = calculateBill({
    monthlyPrice: 3000,
    month: "2026-09",
    subscriptionStartDate: "2026-09-01",
    pauses: [{
      startDate: "2026-09-10",
      endDate: "2026-09-12"
    }]
  });
  assert.equal(result.pausedWeekdays, 2);
  assert.equal(result.servedDays, 20);
});

test("mid-cycle assignment receives its served-day share", () => {
  const result = calculateAssignmentBill({
    monthlyPrice: 3000,
    month: "2026-09",
    subscriptionStartDate: "2026-09-01",
    assignmentStartDate: "2026-09-16",
    assignmentEndDate: null
  });
  assert.equal(result.servedDays, 11);
  assert.equal(result.bill, 1500);
});
