const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
const TOKEN_KEY = "mclass_token";
const USER_KEY = "mclass_user";

export function resolveBackendUrl(pathOrUrl) {
  if (!pathOrUrl || typeof pathOrUrl !== "string") return null;
  if (/^(https?:|data:|blob:)/i.test(pathOrUrl)) return pathOrUrl;
  const origin = API_BASE_URL.replace(/\/api\/?$/, "");
  return `${origin}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

export function clearAuthStorage() {
  for (const store of [localStorage, sessionStorage]) {
    store.removeItem(TOKEN_KEY);
    store.removeItem(USER_KEY);
  }
}

export const tokenStore = {
  get: getAuthToken,
  getUser() {
    const raw = localStorage.getItem(USER_KEY) ?? sessionStorage.getItem(USER_KEY);
    try { return raw ? JSON.parse(raw) : null; } catch { return null; }
  },
  save(token, user, remember) {
    this.clear();
    const store = remember ? localStorage : sessionStorage;
    store.setItem(TOKEN_KEY, token);
    store.setItem(USER_KEY, JSON.stringify(user));
  },
  updateUser(user) {
    const store = localStorage.getItem(TOKEN_KEY) ? localStorage : sessionStorage;
    store.setItem(USER_KEY, JSON.stringify(user));
  },
  clear() {
    clearAuthStorage();
  },
};

export class ApiError extends Error {
  constructor(status, message, errors = null, code = null) {
    super(message);
    this.status = status;
    this.errors = errors;
    this.code = code;
  }
}

export async function apiFetch(endpoint, options = {}, auth = true) {
  const token = getAuthToken();
  const headers = new Headers(options.headers);
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;

  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (auth && token) {
    headers.set("Authorization", "Bearer " + token);
  }

  const baseUrl = API_BASE_URL.replace(/\/+$/, "");
  const normalizedEndpoint = baseUrl.endsWith("/api") && endpoint.startsWith("/api/")
    ? endpoint.slice(4)
    : endpoint;
  const response = await fetch(`${baseUrl}${normalizedEndpoint.startsWith("/") ? "" : "/"}${normalizedEndpoint}`, {
    ...options,
    headers,
  });
  const result = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401 && auth && endpoint !== "/auth/web/login") {
      tokenStore.clear();
      window.location.href = "/login";
    }

    const error = result && typeof result === "object"
      ? { ...result, status: response.status }
      : { message: "Terjadi kesalahan.", status: response.status };
    throw error;
  }

  return result;
}

export async function api(path, { method = "GET", body, auth = true } = {}) {
  try {
    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
    return await apiFetch(path, {
      method,
      body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
    }, auth);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof TypeError) {
      throw new ApiError(0, "Tidak dapat terhubung ke server.");
    }
    throw new ApiError(
      error?.status ?? 0,
      error?.message ?? "Terjadi kesalahan.",
      error?.errors ?? null,
      error?.code ?? null,
    );
  }
}
