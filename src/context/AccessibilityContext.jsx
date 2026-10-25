
import { createContext, useContext, useEffect, useState } from "react";

const AccessibilityContext = createContext(null);

const STORAGE_KEY = "lenas-humos-font-scale";

export function AccessibilityProvider({ children }) {
  const [fontScale, setFontScale] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const value = saved ? Number(saved) : 100;
      return [80, 90, 100, 110, 120, 130, 140, 150].includes(value)
        ? value
        : 100;
    } catch {
      return 100;
    }
  });

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--font-scale",
      `${fontScale / 100}`
    );

    try {
      localStorage.setItem(STORAGE_KEY, String(fontScale));
    } catch {
      // La página sigue funcionando aunque no se pueda guardar.
    }
  }, [fontScale]);

  const decreaseFont = () =>
    setFontScale((current) => Math.max(80, current - 10));

  const increaseFont = () =>
    setFontScale((current) => Math.min(150, current + 10));

  const resetFont = () => setFontScale(100);

  return (
    <AccessibilityContext.Provider
      value={{
        fontScale,
        decreaseFont,
        increaseFont,
        resetFont,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);

  if (!context) {
    throw new Error(
      "useAccessibility debe utilizarse dentro de AccessibilityProvider"
    );
  }

  return context;
}
