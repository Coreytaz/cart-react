import { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { Discount } from "../model/cart";

interface DiscountSettingsProps {
  discount: Discount;
  onChange: (discount: Discount) => void;
}

export default function DiscountSettings({ discount, onChange }: DiscountSettingsProps) {
  const [draft, setDraft] = useState("");

  function changeDraft(value: string) {
    const digits = value.replace(/\D/g, "");
    if (digits === "" || Number(digits) <= 100) setDraft(digits);
  }

  function toggleDiscount() {
    onChange(
      discount.enabled
        ? { enabled: false, percent: 0 }
        : { enabled: true, percent: Number(draft) },
    );
  }

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="discount-content"
        id="discount-header"
      >
        <Typography>Скидка</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div className="discount-controls">
          <TextField
            id="cart-discount"
            label="Скидка"
            value={draft}
            onChange={(event) => changeDraft(event.target.value)}
            disabled={discount.enabled}
            slotProps={{ htmlInput: { inputMode: "numeric", min: 0, max: 100 } }}
            fullWidth
          />
          <Button variant="contained" onClick={toggleDiscount}>
            {discount.enabled ? "Убрать скидки" : "Установить скидку"}
          </Button>
        </div>
      </AccordionDetails>
    </Accordion>
  );
}
