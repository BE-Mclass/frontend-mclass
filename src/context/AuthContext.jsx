import { createContext, useCallback, useContext, useState } from "react";
import { api, tokenStore } from "../lib/api";
import { fetchCurrentUser, loginWeb, logoutWeb } from "../services/authService";

const AuthContext = createContext(null);

// Backend membungkus respons /api/auth/me dalam { data: user }.
// Login mengembalikan { token, user } (tanpa pembungkus data).
const unwrapUser = (payload) => payload?.data ?? payload?.user ?? payload;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => tokenStore.getUser());

  const setCurrentUser = useCallback((nextUser) => {
    tokenStore.updateUser(nextUser);
    setUser(nextUser);
    return nextUser;
  }, []);

  const refreshUser = useCallback(async () => {
    const user = await fetchCurrentUser();
    return setCurrentUser(unwrapUser(user));
  }, [setCurrentUser]);

  const updateProfile = useCallback(async (profile) => {
    const data = await api("/auth/profile", {
      method: "PATCH",
      body: profile,
    });
    return setCurrentUser(unwrapUser(data));
  }, [setCurrentUser]);

  async function login(email, password, remember) {
    const result = await loginWeb(email, password, remember);
    setUser(result.user);
    return result;
  }

  async function logout() {
    await logoutWeb();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);