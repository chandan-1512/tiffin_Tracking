const test = require("node:test");
const assert = require("node:assert/strict");
const { isWeekday } = require("../src/utils/billing");

test("Thursday is a delivery weekday", () => {
  assert.equal(isWeekday(new Date("2026-09-17T00:00:00Z")), true);
});

test("Saturday is not a delivery weekday", () => {
  assert.equal(isWeekday(new Date("2026-09-19T00:00:00Z")), false);
});
