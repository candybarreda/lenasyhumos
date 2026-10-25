import { afterEach, describe, expect, it } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { CartProvider, useCart } from "../../context/CartContext";
import DishCard from "./DishCard";

afterEach(() => {
  cleanup();
  localStorage.clear();
});

const dish = {
  id: "qa-pollo-cilindro",
  name: "Pollo al cilindro QA",
  price: 25,
  description: "Plato de prueba",
  rating: 5,
  reviews: 1,
  image: "",
};

describe("Integración: DishCard + CartContext", () => {
  it("agrega un plato al carrito y actualiza la cantidad y el total", async () => {
    render(
      <CartProvider>
        <DishCard dish={dish} />
      </CartProvider>
    );

    fireEvent.click(
      screen.getByRole("button", { name: /agregar al carrito/i })
    );

    expect(
      await screen.findByText(/pollo al cilindro qa agregado al carrito/i)
    ).toBeTruthy();

    const savedCart = JSON.parse(localStorage.getItem("cart"));

    expect(savedCart).toHaveLength(1);
    expect(savedCart[0].id).toBe(dish.id);
    expect(savedCart[0].quantity).toBe(1);
    expect(savedCart[0].price * savedCart[0].quantity).toBe(25);
  });

  it("incrementa la cantidad al agregar dos veces el mismo plato", async () => {
    render(
      <CartProvider>
        <DishCard dish={dish} />
      </CartProvider>
    );

    const addButton = screen.getByRole("button", {
      name: /agregar al carrito/i,
    });

    fireEvent.click(addButton);
    fireEvent.click(addButton);

    expect(
      await screen.findByText(/pollo al cilindro qa agregado al carrito/i)
    ).toBeTruthy();

    const savedCart = JSON.parse(localStorage.getItem("cart"));

    expect(savedCart).toHaveLength(1);
    expect(savedCart[0].quantity).toBe(2);
    expect(savedCart[0].price * savedCart[0].quantity).toBe(50);
  });
  
  it("recupera del almacenamiento local el plato agregado", async () => {
    const { unmount } = render(
      <CartProvider>
        <DishCard dish={dish} />
      </CartProvider>
    );

    fireEvent.click(
      screen.getByRole("button", { name: /agregar al carrito/i })
    );

    await screen.findByText(/pollo al cilindro qa agregado al carrito/i);

    unmount();

    render(
      <CartProvider>
        <DishCard dish={dish} />
      </CartProvider>
    );

    const savedCart = JSON.parse(localStorage.getItem("cart"));

    expect(savedCart).toHaveLength(1);
    expect(savedCart[0].id).toBe(dish.id);
    expect(savedCart[0].quantity).toBe(1);
    expect(savedCart[0].price).toBe(25);
  });
  
  it("elimina un producto y actualiza localStorage", async () => {
    let cartActions;

    function CartProbe() {
      const { cart, addToCart, removeFromCart, cartTotal } = useCart();
      cartActions = { cart, addToCart, removeFromCart, cartTotal };
      return null;
    }

    render(
      <CartProvider>
        <CartProbe />
      </CartProvider>
    );

    await act(async () => {
      cartActions.addToCart(dish);
    });

    expect(cartActions.cart).toHaveLength(1);

    await act(async () => {
      cartActions.removeFromCart(dish.id);
    });

    expect(cartActions.cart).toHaveLength(0);
    expect(cartActions.cartTotal).toBe(0);
    expect(JSON.parse(localStorage.getItem("cart"))).toEqual([]);
  });

  it("vacía el carrito y actualiza localStorage", async () => {
    let cartActions;

    function CartProbe() {
      const { cart, addToCart, clearCart, cartTotal, cartCount } = useCart();
      cartActions = { cart, addToCart, clearCart, cartTotal, cartCount };
      return null;
    }

    render(
      <CartProvider>
        <CartProbe />
      </CartProvider>
    );

    await act(async () => {
      cartActions.addToCart(dish);
    });

    await act(async () => {
      cartActions.addToCart({ ...dish, id: "qa-chifle", name: "Chifle QA", price: 10 });
    });

    await act(async () => {
      cartActions.clearCart();
    });

    expect(cartActions.cart).toHaveLength(0);
    expect(cartActions.cartCount).toBe(0);
    expect(cartActions.cartTotal).toBe(0);
    expect(JSON.parse(localStorage.getItem("cart"))).toEqual([]);
  });


});
