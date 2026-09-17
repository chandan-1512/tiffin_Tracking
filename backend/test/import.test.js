const test = require("node:test");
const assert = require("node:assert/strict");
const {
  normalizePhone,
  normalizeDate
} = require("../src/services/importService");

test("phone normalization", () => {
  assert.equal(normalizePhone("+91 98765-43210"), "9876543210");
});

test("date normalization", () => {
  assert.equal(normalizeDate("01/09/2026"), "2026-09-01");
  assert.equal(normalizeDate("2026/09/02"), "2026-09-02");
});
