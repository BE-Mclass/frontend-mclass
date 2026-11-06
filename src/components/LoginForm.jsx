import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Waktu realtime
  const currentTime = new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { redirectTo } = await login(
        formData.email.trim(),
        formData.password,
        formData.remember,
      );
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (err.status === 401) {
        setError({
          title: "Login gagal! Email atau kata sandi salah.",
          field: "password",
          message: "Periksa kembali email dan kata sandi Anda.",
        });
      } else if (err.status === 403) {
        setError({ title: "Akses ditolak.", field: null, message: err.message });
      } else {
        setError({ title: "Gagal masuk.", field: null, message: err.message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // ⬇️ Tambahkan class animate-card di container utama
    <div className="animate-card relative mx-auto w-full max-w-[420px] overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

      {/* Ornamen background di dalam card */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-50 opacity-50 blur-2xl"></div>

      {/* Title */}
      <div className="animate-item delay-100 relative z-10">
        <h2 className="text-2xl font-extrabold leading-tight text-gray-900">
          Login Admin Presensi
        </h2>
        <div className="mt-2 flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-700" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span className="text-sm font-bold text-emerald-800">
            MTs Al-Ma'arif O2 Singosari
          </span>
        </div>
      </div>

      {/* Server Status */}
      <div className="animate-item delay-200 relative z-10 mt-5 flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
          <span className="text-xs font-semibold text-emerald-800">
            Server Presensi Terhubung
          </span>
        </div>
        <span className="text-xs font-medium text-emerald-700">
          {currentTime} WIB
        </span>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="animate-item delay-200 relative z-10 mt-4 flex items-center justify-between rounded-lg border border-red-300 bg-red-50 px-3 py-2.5">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <line x1="12" x2="12" y1="9" y2="13" />
              <line x1="12" x2="12.01" y1="17" y2="17" />
            </svg>
            <span className="text-xs font-semibold text-red-700">{error.title}</span>
          </div>
          <button type="button" onClick={() => setError(null)} className="text-red-500 hover:text-red-700" aria-label="Tutup">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="m15 9-6 6M9 9l6 6" />
            </svg>
          </button>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="relative z-10 mt-5 space-y-4">
        {/* Email */}
        <div className="animate-item delay-300">
          <label htmlFor="login-email" className="mb-1.5 block text-sm font-bold text-gray-800">
            Email Madrasah / Kemenag <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="login-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@mtsalmaarif.sch.id atau nama@kemenag.go.id"
              autoComplete="username"
              required
              className={`w-full rounded-lg border bg-white py-2.5 px-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 ${
                error?.field === "email"
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
              }`}
            />
          </div>
        </div>

        {/* Password */}
        <div className="animate-item delay-300">
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="login-password" className="block text-sm font-bold text-gray-800">
              Kata Sandi <span className="text-red-500">*</span>
            </label>
            <Link to="/forgot-password" className="text-xs font-semibold text-emerald-700 hover:underline">
              Lupa Sandi?
            </Link>
          </div>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Masukkan kata sandi"
              autoComplete="current-password"
              required
              className={`w-full rounded-lg border bg-white py-2.5 pl-4 pr-10 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 ${
                error?.field === "password"
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
              }`}
            />
            {error?.field === "password" ? (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m15 9-6 6M9 9l6 6" />
                </svg>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61M2 2l20 20" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            )}
          </div>

          {error?.field === "password" && (
            <p className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-red-600">
              <span className="mt-0.5 inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border border-red-500 text-[9px] font-bold">!</span>
              {error.message}
            </p>
          )}
        </div>

        {/* Checkbox Ingat Perangkat */}
        <label className="animate-item delay-400 flex cursor-pointer items-center gap-2 pt-1">
          <input
            type="checkbox"
            name="remember"
            checked={formData.remember}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span className="text-xs font-medium text-gray-700">
            Ingat Perangkat Ini
          </span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="animate-item delay-400 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 py-3 text-sm font-bold text-white transition duration-200 hover:bg-emerald-800 hover:shadow-md active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? (
            <>
              <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Memproses...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Masuk ke Portal Admin
            </>
          )}
        </button>
      </form>
    </div>
  );
}