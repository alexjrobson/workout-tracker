import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function usernameFromToken(token) {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return json.sub || null;
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const login = (jwt) => {
    localStorage.setItem("token", jwt);
    setToken(jwt);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, username: usernameFromToken(token), login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
