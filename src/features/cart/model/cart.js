/** Convert validated decimal rubles to integer kopecks (avoids float sum errors). */
export function parsePrice(value) {
  const normalized = value.trim().replace(",", ".");
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) return null;

  const [rubles, kopecks = ""] = normalized.split(".");
  const amount = Number(rubles) * 100 + Number(kopecks.padEnd(2, "0"));
  return Number.isSafeInteger(amount) ? amount : null;
}

export function formatPrice(kopecks) {
  const rubles = kopecks / 100;
  const amount = new Intl.NumberFormat("ru-RU", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(rubles);

  if (kopecks % 100 !== 0) return `${amount} руб.`;

  const absoluteRubles = Math.abs(rubles);
  const remainder100 = absoluteRubles % 100;
  const remainder10 = absoluteRubles % 10;
  const suffix =
    remainder100 >= 11 && remainder100 <= 14
      ? "рублей"
      : remainder10 === 1
        ? "рубль"
        : remainder10 >= 2 && remainder10 <= 4
          ? "рубля"
          : "рублей";

  return `${amount} ${suffix}`;
}

export function applyDiscount(priceKopecks, percent) {
  return Math.round(priceKopecks * (1 - percent / 100));
}

export function calculateTotal(cart) {
  return cart.reduce((sum, item) => sum + item.priceKopecks, 0);
}

export function validateItem(values, cart) {
  const errors = {};
  const id = values.id.trim();
  const name = values.name.trim();
  const priceKopecks = parsePrice(values.price);

  if (!id) errors.id = "Укажите ID";
  else if (cart.some((item) => item.id === id)) errors.id = "Этот ID уже добавлен";
  if (!name) errors.name = "Укажите название";
  if (priceKopecks === null) errors.price = "Введите цену в рублях (до 2 знаков после запятой)";

  return { errors, item: { id, name, priceKopecks } };
}
