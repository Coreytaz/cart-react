import { calculateDiscountedTotal, calculateTotal, formatPrice } from "../model/cart.ts";
import type { CartItem, Discount } from "../model/cart";

interface CartSummaryProps {
  cart: readonly CartItem[];
  discount: Discount;
}

export default function CartSummary({ cart, discount }: CartSummaryProps) {
  if (cart.length === 0) return null;

  const total = calculateTotal(cart);

  return (
    <div className="cart-summary" aria-live="polite">
      <div>Всего товаров: {cart.length}</div>
      <div className="cart-summary-total">
        Общая стоимость:{" "}
        {discount.enabled ? (
          <>
            <span className="discount">{formatPrice(total)}</span>{" "}
            <span>{formatPrice(calculateDiscountedTotal(cart, discount.percent))}</span>
          </>
        ) : (
          formatPrice(total)
        )}
      </div>
    </div>
  );
}
