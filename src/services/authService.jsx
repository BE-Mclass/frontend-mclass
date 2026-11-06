import { apiFetch, clearAuthStorage, tokenStore } from "../lib/api";

export async function loginWeb(email, password, rememberMe = false) {
  const res = await apiFetch("/auth/web/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      remember_me: rememberMe,
    }),
  }, false);

  const { token, user, redirect_to: redirectTo } = res.data;
  tokenStore.save(token, user, rememberMe);

  return {
    user,
    redirectTo: redirectTo || "/dashboard",
  };
}

export async function fetchCurrentUser() {
  const res = await apiFetch("/auth/me", {
    method: "GET",
  });
  return res.data;
}

export async function logoutWeb() {
  try {
    await apiFetch("/auth/logout", {
      method: "POST",
    });
  } catch (error) {
    console.warn("Gagal mencabut sesi di server:", error);
  } finally {
    clearAuthStorage();
  }
}
