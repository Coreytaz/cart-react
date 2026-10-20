import test from "node:test";
import assert from "node:assert/strict";
import {
  applyDiscount,
  calculateTotal,
  calculateDiscountedTotal,
  formatPrice,
  parsePrice,
  validateItem,
} from "../src/features/cart/model/cart.ts";

test("parses prices into integer kopecks", () => {
  assert.equal(parsePrice("123"), 12300);
  assert.equal(parsePrice("123,45"), 12345);
  assert.equal(parsePrice(" 0.07 "), 7);
  assert.equal(parsePrice("0"), 0);
});

test("rejects invalid, negative, imprecise and unsafe prices", () => {
  for (const value of ["", "abc", "-5", "1.234", "1e3", "Infinity", "1,234", "99999999999999999"]) {
    assert.equal(parsePrice(value), null, `Should reject ${value}`);
  }
});

test("formats whole ruble declensions correctly", () => {
  const sample: [number, string][] = [
    [100, "рубль"],
    [200, "рубля"],
    [500, "рублей"],
    [1100, "рублей"],
    [2100, "рубль"],
    [1400, "рублей"],
    [10100, "рубль"],
  ];
  for (const [amount, suffix] of sample) assert.ok(formatPrice(amount).endsWith(suffix));
  assert.ok(formatPrice(12345).includes("руб."));
});

test("uses integer arithmetic for totals", () => {
  assert.equal(calculateTotal([{ priceKopecks: 10 }, { priceKopecks: 20 }]), 30);
  assert.equal(calculateTotal([]), 0);
});

test("applies 0–100% discount to kopecks", () => {
  assert.equal(applyDiscount(19900, 0), 19900);
  assert.equal(applyDiscount(19900, 20), 15920);
  assert.equal(applyDiscount(999, 50), 500);
  assert.equal(applyDiscount(19900, 100), 0);
});

test("trims validated ID/name and rejects duplicates", () => {
  const existing = [{ id: "book", name: "Старая книга", priceKopecks: 2000 }];
  const result = validateItem({ id: " book ", name: "Новая", price: "10" }, existing);
  assert.equal(result.errors.id, "Этот ID уже добавлен");

  const valid = validateItem({ id: " new ", name: "  Товар  ", price: "1,25" }, existing);
  assert.deepEqual(valid.errors, {});
  assert.deepEqual(valid.item, { id: "new", name: "Товар", priceKopecks: 125 });
});

test("reports all missing required fields", () => {
  const { errors } = validateItem({ id: " ", name: "  ", price: "" }, []);
  assert.equal(Object.keys(errors).length, 3);
});

test("discounted line totals agree with displayed item prices", () => {
  const items = [{ priceKopecks: 1 }, { priceKopecks: 1 }];
  assert.equal(calculateDiscountedTotal(items, 50), 2);
  assert.equal(calculateDiscountedTotal(items, 100), 0);
});
