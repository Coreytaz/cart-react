export interface CartItem {
  id: string;
  name: string;
  /** Price in integer kopecks. */
  priceKopecks: number;
}

export interface Discount {
  enabled: boolean;
  percent: number;
}

export interface CartFormValues {
  id: string;
  name: string;
  price: string;
}

export type CartFormErrors = Partial<Record<keyof CartFormValues, string>>;

export interface ItemValidationResult {
  errors: CartFormErrors;
  item: CartItem | null;
}

/** Convert validated decimal rubles to integer kopecks (avoids float sum errors). */
export function parsePrice(value: string): number | null {
  const normalized = value.trim().replace(",", ".");
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) return null;

  const [rubles, kopecks = ""] = normalized.split(".");
  const amount = Number(rubles) * 100 + Number(kopecks.padEnd(2, "0"));
  return Number.isSafeInteger(amount) ? amount : null;
}

export function formatPrice(kopecks: number): string {
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

export function applyDiscount(priceKopecks: number, percent: number): number {
  return Math.round(priceKopecks * (1 - percent / 100));
}

export function calculateTotal(cart: readonly Pick<CartItem, "priceKopecks">[]): number {
  return cart.reduce((sum, item) => sum + item.priceKopecks, 0);
}

/** Sum displayed discounted line prices to keep line items and summary in sync. */
export function calculateDiscountedTotal(
  cart: readonly Pick<CartItem, "priceKopecks">[],
  percent: number,
): number {
  return cart.reduce((sum, item) => sum + applyDiscount(item.priceKopecks, percent), 0);
}

export function validateItem(values: CartFormValues, cart: readonly CartItem[]): ItemValidationResult {
  const errors: CartFormErrors = {};
  const id = values.id.trim();
  const name = values.name.trim();
  const priceKopecks = parsePrice(values.price);

  if (!id) errors.id = "Укажите ID";
  else if (cart.some((item) => item.id === id)) errors.id = "Этот ID уже добавлен";
  if (!name) errors.name = "Укажите название";
  if (priceKopecks === null) errors.price = "Введите цену в рублях (до 2 знаков после запятой)";

  return {
    errors,
    item: Object.keys(errors).length === 0 && priceKopecks !== null
      ? { id, name, priceKopecks }
      : null,
  };
}
