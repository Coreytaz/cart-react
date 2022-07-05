import React from "react";

import "./App.css";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
function App() {
  const [cart, setCart] = React.useState([]);
  const [id, setId] = React.useState("");
  const [name, setName] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [idError, setIdError] = React.useState(false);
  const [nameError, setNameError] = React.useState(false);
  const [priceError, setPriceError] = React.useState(false);
  const [discount, setDiscount] = React.useState("");
  const [isDiscount, setIsDiscount] = React.useState(false);

  const addCart = () => {
    debugger;
    if (id.length === 0) {
      setIdError(true);
    }
    if (name.length === 0) {
      setNameError(true);
    }
    if (price.length === 0) {
      setPriceError(true);
    }
    if (
      id.trim("").length &&
      name.trim("").length &&
      price.trim("").length &&
      isIdIncludes(id)
    ) {
      setCart([
        ...cart,
        {
          id,
          name,
          price,
        },
      ]);
    } else {
      setTimeout(() => {
        setIdError(false);
        setNameError(false);
        setPriceError(false);
      }, 2000);
      return;
    }
    setId("");
    setName("");
    setPrice("");
    setIdError(false);
    setNameError(false);
    setPriceError(false);
  };

  function isIdIncludes(id) {
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].id === id) {
        return false;
      }
    }
    return true;
  }

  const removeCart = (idCart) => {
    setCart(cart.filter((c) => c.id !== idCart));
  };

  function declOfNum(number, words) {
    return words[
      number % 100 > 4 && number % 100 < 20
        ? 2
        : [2, 0, 1, 1, 1, 2][number % 10 < 5 ? Math.abs(number) % 10 : 5]
    ];
  }

  function changeDiscount(values) {
    if (values <= 100) {
      return setDiscount(values.replace(/\D/g, ""));
    }
  }

  function changeDiscountPrice(price) {
    return (price * (1 - +discount / 100)).toFixed(0);
  }

  return (
    <>
      <CssBaseline>
        <Container maxWidth="sm">
          <h1 className="center">
            React-cart <ShoppingCartIcon />
          </h1>
          <div className="flex">
            <TextField
              value={id}
              onChange={(e) => setId(e.target.value)}
              id="outlined-basic"
              label="id"
              variant="outlined"
              error={idError ? true : false}
              helperText={idError ? "ID пустой!" : ""}
            />
            <TextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="outlined-basic"
              label="Название"
              variant="outlined"
              error={nameError ? true : false}
              helperText={nameError ? "Имя пустое!" : " "}
            />
            <TextField
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              id="outlined-basic"
              label="Цена"
              variant="outlined"
              error={priceError ? true : false}
              helperText={priceError ? "Цена пустая!" : " "}
            />
          </div>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Скидка</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <Stack
                  mt={2}
                  mb={2}
                  justifyContent="space-between"
                  direction="row"
                >
                  <TextField
                    id="outlined-basic"
                    label="Скидка"
                    variant="outlined"
                    value={discount}
                    onChange={(e) => changeDiscount(e.target.value)}
                    disabled={isDiscount}
                  />
                  {isDiscount ? (
                    <Button
                      onClick={() => setIsDiscount(!isDiscount)}
                      variant="contained"
                    >
                      Убрать скидки
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setIsDiscount(!isDiscount)}
                      variant="contained"
                    >
                      Установить скидку
                    </Button>
                  )}
                </Stack>
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Stack mt={2} mb={2} justifyContent="center">
            <Button
              onClick={addCart}
              variant="contained"
              endIcon={<ShoppingCartIcon />}
            >
              Add
            </Button>
          </Stack>
          <Box component="div" sx={{ p: 2, border: "1px dashed grey" }}>
            <ul>
              {!cart.length ? (
                <h1 className="center">Корзина пустая 😔</h1>
              ) : (
                cart.map((item) => (
                  <li key={item.id}>
                    <div>
                      <span>Имя: {item.name}</span>
                      <span>ID: {item.id}</span>
                    </div>
                    <div>
                      <div>
                        {isDiscount ? (
                          <span className="discount">{item.price}</span>
                        ) : (
                          item.price +
                          " " +
                          declOfNum(item.price, ["Рубль.", "Рубля.", "Рублей."])
                        )}{" "}
                        {isDiscount &&
                          changeDiscountPrice(item.price) +
                            " " +
                            declOfNum(changeDiscountPrice(item.price), [
                              "Рубль.",
                              "Рубля.",
                              "Рублей.",
                            ])}
                      </div>
                      <DeleteIcon onClick={() => removeCart(item.id)} />
                    </div>
                  </li>
                ))
              )}
            </ul>
          </Box>
          {cart.length ? (
            <div className="count">
              <div>Всего товаров: {cart.length}</div>
              <div>
                Общая стоимость:{" "}
                {isDiscount ? (
                  <span className="discount">
                    {cart.reduce((a, b) => a + Number(b.price), 0)}
                  </span>
                ) : (
                  cart.reduce((a, b) => a + Number(b.price), 0) +
                  " " +
                  declOfNum(
                    cart.reduce((a, b) => a + Number(b.price), 0),
                    ["Рубль.", "Рубля.", "Рублей."]
                  )
                )}{" "}
                {isDiscount &&
                  changeDiscountPrice(
                    cart.reduce((a, b) => a + Number(b.price), 0)
                  ) +
                    " " +
                    declOfNum(
                      changeDiscountPrice(
                        cart.reduce((a, b) => a + Number(b.price), 0)
                      ),
                      ["Рубль.", "Рубля.", "Рублей."]
                    )}
              </div>
            </div>
          ) : (
            ""
          )}
        </Container>
      </CssBaseline>
    </>
  );
}

export default App;
