import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");

      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error al cargar el carrito:", error);
      return [];
    }
  });

  // =====================================
  // GUARDAR CARRITO
  // =====================================

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // =====================================
  // AGREGAR PRODUCTO
  // =====================================

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingProduct = currentCart.find(
        (item) => item.id === product.id
      );

      if (existingProduct) {
        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  // =====================================
  // AUMENTAR CANTIDAD
  // =====================================

  const increaseQuantity = (id) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  // =====================================
  // DISMINUIR CANTIDAD
  // =====================================

  const decreaseQuantity = (id) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // =====================================
  // ELIMINAR PRODUCTO
  // =====================================

  const removeFromCart = (id) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== id)
    );
  };

  // =====================================
  // VACIAR CARRITO
  // =====================================

  const clearCart = () => {
    setCart([]);
  };

  // =====================================
  // CANTIDAD TOTAL
  // =====================================

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // =====================================
  // TOTAL DEL CARRITO
  // =====================================

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart debe utilizarse dentro de CartProvider"
    );
  }

  return context;
};