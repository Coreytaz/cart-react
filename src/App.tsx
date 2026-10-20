import { useState } from "react";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddItemForm from "./features/cart/components/AddItemForm";
import DiscountSettings from "./features/cart/components/DiscountSettings";
import CartList from "./features/cart/components/CartList";
import CartSummary from "./features/cart/components/CartSummary";
import type { CartItem, Discount } from "./features/cart/model/cart";
import "./App.css";

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState<Discount>({ enabled: false, percent: 0 });

  function removeItem(id: string) {
    setCart((items) => items.filter((item) => item.id !== id));
  }

  function addItem(item: CartItem) {
    setCart((items) => [...items, item]);
  }

  return (
    <>
      <CssBaseline />
      <Container maxWidth="sm" component="main" className="cart-app">
        <h1 className="cart-heading">
          React-cart <ShoppingCartIcon aria-hidden="true" />
        </h1>
        <AddItemForm cart={cart} onAdd={addItem} />
        <DiscountSettings discount={discount} onChange={setDiscount} />
        <CartList cart={cart} discount={discount} onRemove={removeItem} />
        <CartSummary cart={cart} discount={discount} />
      </Container>
    </>
  );
}
