import { createContext, useContext, useState } from "react";
import { findOrCreateUser, getSession, setSession, getUsers, updateUser, getModule, setModule } from "../data/store.js";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [session, setSessionState] = useState(getSession()); // { role, userId } | null
  const [user, setUser] = useState(() => {
    const s = getSession();
    return s && s.role === "user" ? getUsers().find((u) => u.id === s.userId) || null : null;
  });
  const [module, setModuleState] = useState(getModule());

  const login = ({ role, email, name }) => {
    if (role === "admin") {
      const s = { role: "admin", userId: null, name: "Admin" };
      setSession(s);
      setSessionState(s);
      return;
    }
    const u = findOrCreateUser(email, name);
    const s = { role: "user", userId: u.id };
    setSession(s);
    setSessionState(s);
    setUser(u);
  };

  const logout = () => {
    setSession(null);
    setSessionState(null);
    setUser(null);
  };

  const saveUser = (updated) => {
    const saved = updateUser(updated);
    if (saved) setUser(saved);
    return !!saved;
  };

  const chooseModule = (m) => {
    setModule(m);
    setModuleState(m);
  };

  return (
    <AuthContext.Provider value={{ session, user, module, login, logout, saveUser, chooseModule }}>
      {children}
    </AuthContext.Provider>
  );
}
