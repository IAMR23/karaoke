// src/context/AuthContext.js
import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    rol: null,
    userId: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setAuth({
          isAuthenticated: true,
          rol: decoded.rol,
          userId: decoded.userId,
        });
      } catch {
        setAuth({ isAuthenticated: false, rol: null, userId: null });
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
