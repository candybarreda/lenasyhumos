
import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading] = useState(false);

  const login = async (email, password) => {
    const authenticatedUser = await authService.login(
      email,
      password
    );

    setUser(authenticatedUser);
    return authenticatedUser;
  };

  const register = async (name, email, password) => {
    const authenticatedUser = await authService.register(
      name,
      email,
      password
    );

    setUser(authenticatedUser);
    return authenticatedUser;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const resetPassword = async (email) => {
    return authService.resetPassword(email);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      authAvailable: false,
      login,
      register,
      logout,
      resetPassword,
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth debe utilizarse dentro de AuthProvider"
    );
  }

  return context;
}

