
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { CartProvider, useCart } from "./CartContext";

const wrapper = ({ children }) => (
  <CartProvider>{children}</CartProvider>
);

const product = {
  id: 1,
  name: "Pollo al cilindro",
  price: 25,
};

describe("CartContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("inicia con el carrito vacío", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.cart).toEqual([]);
    expect(result.current.cartCount).toBe(0);
    expect(result.current.cartTotal).toBe(0);
  });

  it("agrega un producto con cantidad inicial de uno", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addToCart(product));

    expect(result.current.cart).toEqual([
      { ...product, quantity: 1 },
    ]);
    expect(result.current.cartCount).toBe(1);
    expect(result.current.cartTotal).toBe(25);
  });

  it("incrementa la cantidad al agregar el mismo producto", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(product);
      result.current.addToCart(product);
    });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].quantity).toBe(2);
    expect(result.current.cartTotal).toBe(50);
  });

  it("aumenta y disminuye la cantidad", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(product);
      result.current.increaseQuantity(product.id);
    });

    expect(result.current.cart[0].quantity).toBe(2);

    act(() => result.current.decreaseQuantity(product.id));

    expect(result.current.cart[0].quantity).toBe(1);
    expect(result.current.cartTotal).toBe(25);
  });

  it("elimina el producto cuando llega a cero", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(product);
      result.current.decreaseQuantity(product.id);
    });

    expect(result.current.cart).toEqual([]);
    expect(result.current.cartCount).toBe(0);
    expect(result.current.cartTotal).toBe(0);
  });

  it("elimina un producto específico", () => {
    const secondProduct = {
      id: 2,
      name: "Gaseosa",
      price: 5,
    };

    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(product);
      result.current.addToCart(secondProduct);
      result.current.removeFromCart(product.id);
    });

    expect(result.current.cart).toEqual([
      { ...secondProduct, quantity: 1 },
    ]);
    expect(result.current.cartTotal).toBe(5);
  });

  it("vacía todo el carrito", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(product);
      result.current.clearCart();
    });

    expect(result.current.cart).toEqual([]);
    expect(result.current.cartCount).toBe(0);
    expect(result.current.cartTotal).toBe(0);
  });

  it("guarda el carrito en localStorage", async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addToCart(product));

    await waitFor(() => {
      expect(JSON.parse(localStorage.getItem("cart"))).toEqual([
        { ...product, quantity: 1 },
      ]);
    });
  });

  it("recupera el carrito guardado en localStorage", () => {
    localStorage.setItem(
      "cart",
      JSON.stringify([{ ...product, quantity: 2 }]),
    );

    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.cart).toEqual([
      { ...product, quantity: 2 },
    ]);
    expect(result.current.cartTotal).toBe(50);
  });
});
