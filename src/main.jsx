
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { CartProvider } from "./context/CartContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AccessibilityProvider } from "./context/AccessibilityContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <CartProvider>
        <AccessibilityProvider>
          <App />
        </AccessibilityProvider>
      </CartProvider>
    </ThemeProvider>
  </StrictMode>
);
