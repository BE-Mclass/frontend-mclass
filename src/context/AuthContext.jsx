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

  const uploadAvatar = useCallback(async (fileOrBase64) => {
    let body;
    if (typeof File !== "undefined" && fileOrBase64 instanceof File) {
      const formData = new FormData();
      formData.append("file", fileOrBase64);
      body = formData;
    } else {
      body = { avatar: fileOrBase64 };
    }

    const res = await api("/auth/me/avatar", {
      method: "POST",
      body,
    });

    const avatarData = res?.data ?? res;
    const nextPhotoUrl = avatarData?.photo_url ?? avatarData?.avatar_url ?? null;
    const current = tokenStore.getUser() ?? {};
    const updatedUser = {
      ...current,
      photo_url: nextPhotoUrl,
      avatar_url: nextPhotoUrl,
    };
    setCurrentUser(updatedUser);
    return updatedUser;
  }, [setCurrentUser]);

  const deleteAvatar = useCallback(async () => {
    await api("/auth/me/avatar", {
      method: "DELETE",
    });

    const current = tokenStore.getUser() ?? {};
    const updatedUser = {
      ...current,
      photo_url: null,
      avatar_url: null,
    };
    setCurrentUser(updatedUser);
    return updatedUser;
  }, [setCurrentUser]);

  const fetchSessions = useCallback(async () => {
    const res = await api("/auth/sessions", {
      method: "GET",
    });
    return res?.data ?? [];
  }, []);

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
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        refreshUser,
        updateProfile,
        uploadAvatar,
        deleteAvatar,
        fetchSessions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
