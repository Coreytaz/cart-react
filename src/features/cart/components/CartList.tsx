import Box from "@mui/material/Box";
import CartItem from "./CartItem";
import type { CartItem as CartItemModel, Discount } from "../model/cart";

interface CartListProps {
  cart: readonly CartItemModel[];
  discount: Discount;
  onRemove: (id: string) => void;
}

export default function CartList({ cart, discount, onRemove }: CartListProps) {
  return (
    <Box component="section" aria-label="Корзина" sx={{ p: 2, border: "1px dashed grey" }}>
      {cart.length === 0 ? (
        <p className="cart-empty" role="status">Корзина пустая 😔</p>
      ) : (
        <ul className="cart-list">
          {cart.map((item) => (
            <CartItem key={item.id} item={item} discount={discount} onRemove={onRemove} />
          ))}
        </ul>
      )}
    </Box>
  );
}
