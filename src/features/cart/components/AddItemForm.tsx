import { useState } from "react";
import type { FormEvent } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { validateItem } from "../model/cart.ts";
import type { CartFormErrors, CartFormValues, CartItem } from "../model/cart";

interface AddItemFormProps {
  cart: readonly CartItem[];
  onAdd: (item: CartItem) => void;
}

const emptyValues: CartFormValues = { id: "", name: "", price: "" };

export default function AddItemForm({ cart, onAdd }: AddItemFormProps) {
  const [values, setValues] = useState<CartFormValues>(emptyValues);
  const [errors, setErrors] = useState<CartFormErrors>({});

  function changeField(field: keyof CartFormValues, value: string) {
    setValues((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = validateItem(values, cart);
    if (result.item === null) {
      setErrors(result.errors);
      return;
    }

    onAdd(result.item);
    setValues(emptyValues);
    setErrors({});
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="cart-form-fields">
        <TextField
          id="cart-item-id"
          label="ID"
          value={values.id}
          onChange={(event) => changeField("id", event.target.value)}
          error={Boolean(errors.id)}
          helperText={errors.id || " "}
          size="medium"
          fullWidth
        />
        <TextField
          id="cart-item-name"
          label="Название"
          value={values.name}
          onChange={(event) => changeField("name", event.target.value)}
          error={Boolean(errors.name)}
          helperText={errors.name || " "}
          fullWidth
        />
        <TextField
          id="cart-item-price"
          label="Цена"
          value={values.price}
          onChange={(event) => changeField("price", event.target.value)}
          error={Boolean(errors.price)}
          helperText={errors.price || " "}
          slotProps={{ htmlInput: { inputMode: "decimal" } }}
          fullWidth
        />
      </div>
      <div className="cart-add-button">
        <Button type="submit" variant="contained" endIcon={<ShoppingCartIcon />}>
          Add
        </Button>
      </div>
    </form>
  );
}
