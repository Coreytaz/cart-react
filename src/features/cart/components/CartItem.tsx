import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { applyDiscount, formatPrice } from "../model/cart.ts";
import type { CartItem as CartItemModel, Discount } from "../model/cart";

interface CartItemProps {
  item: CartItemModel;
  discount: Discount;
  onRemove: (id: string) => void;
}

export default function CartItem({ item, discount, onRemove }: CartItemProps) {
  const originalPrice = formatPrice(item.priceKopecks);
  const finalPrice = discount.enabled
    ? formatPrice(applyDiscount(item.priceKopecks, discount.percent))
    : originalPrice;

  return (
    <li className="cart-item">
      <div className="cart-item-details">
        <span className="cart-item-name">Имя: {item.name}</span>
        <span className="cart-item-id">ID: {item.id}</span>
      </div>
      <div className="cart-item-actions">
        <div className="cart-price">
          {discount.enabled ? (
            <>
              <del
                className="discount"
                aria-label={`Цена до скидки: ${originalPrice}`}
              >
                {originalPrice}
              </del>
              <span>{finalPrice}</span>
            </>
          ) : (
            <span>{finalPrice}</span>
          )}
        </div>
        <IconButton aria-label={`Удалить ${item.name} из корзины`} onClick={() => onRemove(item.id)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </div>
    </li>
  );
}
