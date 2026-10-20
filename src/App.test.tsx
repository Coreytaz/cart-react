import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { UserEvent } from "@testing-library/user-event";
import App from "./App";

afterEach(cleanup);

interface ItemInput {
  id?: string;
  name?: string;
  price?: string;
}

async function addItem(user: UserEvent, { id = "book", name = "Книга", price = "100" }: ItemInput = {}) {
  await user.type(screen.getByRole("textbox", { name: "ID" }), id);
  await user.type(screen.getByRole("textbox", { name: "Название" }), name);
  await user.type(screen.getByRole("textbox", { name: "Цена" }), price);
  await user.click(screen.getByRole("button", { name: /Add/i }));
}

describe("Корзина", () => {
  it("renders an empty state and validates required fields", async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(screen.getByText(/Корзина пустая/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Add/i }));
    expect(screen.getByText("Укажите ID")).toBeInTheDocument();
    expect(screen.getByText("Укажите название")).toBeInTheDocument();
    expect(screen.getByText(/Введите цену/)).toBeInTheDocument();
  });

  it("adds, totals and removes an item", async () => {
    const user = userEvent.setup();
    render(<App />);
    await addItem(user);
    expect(screen.getByText("Имя: Книга")).toBeInTheDocument();
    expect(screen.getByText("Всего товаров: 1")).toBeInTheDocument();
    expect(screen.getByText(/Общая стоимость:/)).toHaveTextContent("100 рублей");
    await user.click(screen.getByRole("button", { name: "Удалить Книга из корзины" }));
    expect(screen.getByText(/Корзина пустая/)).toBeInTheDocument();
  });

  it("keeps total consistent with rounded discounted item prices", async () => {
    const user = userEvent.setup();
    render(<App />);
    await addItem(user, { id: "one", name: "Первый", price: "0.01" });
    await addItem(user, { id: "two", name: "Второй", price: "0.01" });
    await user.click(screen.getByRole("button", { name: /Скидка/i }));
    await user.type(await screen.findByRole("textbox", { name: "Скидка" }), "50");
    await user.click(screen.getByRole("button", { name: "Установить скидку" }));
    expect(screen.getByText(/Общая стоимость:/)).toHaveTextContent("0,02 руб.");
  });

  it("does not allow repeated IDs", async () => {
    const user = userEvent.setup();
    render(<App />);
    await addItem(user);
    await addItem(user, { id: "book", name: "Дубль", price: "200" });
    expect(screen.getByText("Этот ID уже добавлен")).toBeInTheDocument();
    expect(screen.getByText("Всего товаров: 1")).toBeInTheDocument();
  });

  it("applies and removes discounts", async () => {
    const user = userEvent.setup();
    render(<App />);
    await addItem(user);
    await user.click(screen.getByRole("button", { name: /Скидка/i }));
    const discountField = await screen.findByRole("textbox", { name: "Скидка" });
    await user.type(discountField, "20");
    await user.click(screen.getByRole("button", { name: "Установить скидку" }));
    expect(screen.getByText(/Общая стоимость:/)).toHaveTextContent("80 рублей");
    await user.click(screen.getByRole("button", { name: "Убрать скидки" }));
    expect(screen.getByText(/Общая стоимость:/)).toHaveTextContent("100 рублей");
  });
});
