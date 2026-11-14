import { useEffect, useState } from "react";
import DashboardLayout from "./dashboard/DashboardLayout";
import ModalGantiFoto from "./ModalGantiFoto";
import ModalHapusFoto from "./ModalHapusFoto";
import Toast from "./Toast";
import { useAuth } from "../context/AuthContext";
import { resolveBackendUrl } from "../lib/api";

function toProfile(user) {
  return {
    nama: user?.name ?? user?.nama ?? "",
    email: user?.email ?? "",
    role: user?.role ?? "",
    staffCode: user?.staff_code ?? "AGR-001",
  };
}

function getInitials(nameOrEmail) {
  const raw = (nameOrEmail || "User").trim();
  const parts = raw.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return raw.slice(0, 2).toUpperCase();
}

function formatSessionDate(isoString) {
  if (!isoString) return "-";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Pengaturan() {
  const {
    user,
    refreshUser,
    updateProfile,
    uploadAvatar,
    deleteAvatar,
    fetchSessions,
  } = useAuth();

  const [profile, setProfile] = useState(() => toProfile(user));
  const [fotoProfil, setFotoProfil] = useState(() =>
    resolveBackendUrl(user?.photo_url ?? user?.avatar_url)
  );
  const [sessions, setSessions] = useState([]);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [showFotoModal, setShowFotoModal] = useState(false);
  const [showHapusModal, setShowHapusModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [fieldErrors, setFieldErrors] = useState({});

  const [toast, setToast] = useState({
    open: false,
    title: "",
    message: "",
    type: "success",
  });

  useEffect(() => {
    setProfile(toProfile(user));
    setFotoProfil(resolveBackendUrl(user?.photo_url ?? user?.avatar_url));
  }, [user]);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      refreshUser(),
      fetchSessions().catch(() => []),
    ])
      .then(([currentUser, sessionList]) => {
        if (!isMounted) return;
        setProfile(toProfile(currentUser));
        setFotoProfil(
          resolveBackendUrl(currentUser?.photo_url ?? currentUser?.avatar_url)
        );
        if (Array.isArray(sessionList)) {
          setSessions(sessionList);
        }
      })
      .catch((error) => {
        if (isMounted) {
          setToast({
            open: true,
            title: "Gagal memuat profil",
            message: error.message,
            type: "error",
          });
        }
      })
      .finally(() => {
        if (isMounted) setIsLoadingProfile(false);
      });

    return () => {
      isMounted = false;
    };
  }, [refreshUser, fetchSessions]);

  const handleSimpanFoto = async (fileOrDataUrl) => {
    try {
      const updatedUser = await uploadAvatar(fileOrDataUrl);
      const nextUrl = resolveBackendUrl(
        updatedUser?.photo_url ?? updatedUser?.avatar_url
      );
      setFotoProfil(nextUrl);
      setShowFotoModal(false);
      setToast({
        open: true,
        title: "Foto Profil Berhasil Disimpan",
        message: "Foto profil Anda telah diperbarui di server.",
        type: "success",
      });
    } catch (error) {
      setToast({
        open: true,
        title: "Gagal Mengunggah Foto Profil",
        message: error.message || "Terjadi kesalahan saat mengunggah foto.",
        type: "error",
      });
      throw error;
    }
  };

  const handleHapusFoto = async () => {
    setIsDeleting(true);
    try {
      const updatedUser = await deleteAvatar();
      setFotoProfil(
        resolveBackendUrl(updatedUser?.photo_url ?? updatedUser?.avatar_url)
      );
      setShowHapusModal(false);
      setToast({
        open: true,
        title: "Foto Profil Dihapus",
        message: "Avatar default telah berhasil diterapkan.",
        type: "success",
      });
    } catch (error) {
      setShowHapusModal(false);
      setToast({
        open: true,
        title: "Gagal Menghapus Foto Profil",
        message:
          error?.errors?.avatar ||
          error?.message ||
          "Gagal menghapus foto profil karena Anda belum memasang foto profil.",
        type: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResetChanges = () => {
    setProfile(toProfile(user));
    setCurrentPassword("");
    setNewPassword("");
    setFieldErrors({});
  };

  const handleSimpanPerubahan = async () => {
    setIsSavingProfile(true);
    setFieldErrors({});

    try {
      const payload = {
        name: profile.nama,
        email: profile.email,
      };

      if (newPassword.trim() || currentPassword.trim()) {
        payload.current_password = currentPassword;
        payload.new_password = newPassword;
        payload.new_password_confirmation = newPassword;
      }

      const updatedUser = await updateProfile(payload);
      setProfile(toProfile(updatedUser));
      setCurrentPassword("");
      setNewPassword("");
      setToast({
        open: true,
        title: "Perubahan Berhasil Disimpan",
        message: "Data profil dan pengaturan akun Anda telah diperbarui.",
        type: "success",
      });
    } catch (error) {
      if (error.errors && typeof error.errors === "object") {
        setFieldErrors(error.errors);
      }
      setToast({
        open: true,
        title: "Gagal menyimpan perubahan",
        message: error.message,
        type: "error",
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleProfileChange = (field, value) => {
    const stateKey = field === "name" ? "nama" : field;
    setProfile((currentProfile) => ({ ...currentProfile, [stateKey]: value }));
    setFieldErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
  };

  const getFieldError = (field) => {
    const error = fieldErrors[field];
    const message = Array.isArray(error) ? error[0] : error;
    return typeof message === "string" ? message : null;
  };

  const avatarInitials = getInitials(profile.nama || profile.email);

  return (
    <DashboardLayout>
        <main className="flex-1 overflow-y-auto p-6">

          {/* BANNER HIJAU */}
          <div className="animate-item delay-100 relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 to-emerald-600 p-6 text-white transition-all duration-300 hover:shadow-lg">
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/5"></div>
            <div className="absolute -bottom-12 -left-6 h-40 w-40 rounded-full bg-white/5"></div>

            <div className="relative flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15 backdrop-blur">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-wider text-emerald-100">
                    PUSAT KENDALI PROFIL MADRASAH
                  </p>
                  <h2 className="mt-1 text-2xl font-extrabold">
                    Pengaturan Akun Admin
                  </h2>
                  <p className="mt-1 text-xs text-emerald-50">
                    Kelola rekening profil identitas pengguna, hak akses kredensial madrasah, dan sistem notifikasi saat ini.
                  </p>
                </div>
              </div>
              <div className="hidden items-center gap-2 rounded-lg bg-white/10 px-3 py-2 backdrop-blur md:flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span className="text-[10px] font-semibold">
                  Terverifikasi Kemenag
                </span>
              </div>
            </div>
          </div>

          {/* SECTION TITLE */}
          <div className="animate-item delay-200 mt-6 mb-4 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <h3 className="text-base font-bold text-gray-900">
              Informasi Profil Akun
            </h3>
          </div>

          {/* 2-COLUMN LAYOUT */}
          <div className="animate-item delay-300 grid grid-cols-1 items-stretch gap-4 lg:grid-cols-[320px_1fr]">

            {/* ==================== LEFT COLUMN ==================== */}
            <div className="flex flex-col gap-4">
              {/* ==== KARTU PROFIL ==== */}
              <div className="rounded-xl border border-gray-200 bg-white p-5 text-center transition-all duration-300 hover:shadow-md">
                <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-emerald-100 bg-emerald-700 text-3xl font-extrabold text-white shadow-sm">
                  {fotoProfil ? (
                    <img src={fotoProfil} alt="Foto Profil" className="h-full w-full object-cover" />
                  ) : (
                    avatarInitials
                  )}
                </div>

                <h4 className="mt-3 text-sm font-bold text-gray-900">
                  {profile.nama || "Petugas Madrasah"}
                </h4>
                <p className="mt-0.5 flex items-center justify-center gap-1 text-[10px] text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  Guru / Petugas Admin Presensi
                </p>

                <div className="mt-4 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setShowFotoModal(true)}
                    className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[10px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                    </svg>
                    Ganti Foto
                  </button>
                  <span className="text-[9px] text-gray-400">atau</span>
                  <button
                    onClick={() => setShowHapusModal(true)}
                    className="text-[10px] font-semibold text-red-500 hover:underline"
                  >
                    Hapus
                  </button>
                </div>
                <p className="mt-2 text-[9px] text-gray-400">
                  Format JPG, PNG maksimal 5MB. Disarankan 500x500.
                </p>
              </div>

              {/* ==== LOG SESI TERAKHIR ==== */}
              <div className="flex flex-1 flex-col rounded-xl border border-gray-200 bg-white p-5 transition-all duration-300 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-900">
                    Log Sesi Terakhir
                  </h4>
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-bold text-blue-600">
                    Keamanan
                  </span>
                </div>

                <div className="mt-3 flex-1 space-y-3">
                  {sessions.length > 0 ? (
                    sessions.slice(0, 3).map((session) => {
                      const isCurrent = Boolean(session.is_current);
                      return (
                        <div
                          key={session.id}
                          className={`relative rounded-lg border p-3 ${
                            isCurrent
                              ? "border-emerald-200 bg-emerald-50/40"
                              : "border-gray-100 bg-gray-50/50"
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <div
                              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                                isCurrent
                                  ? "bg-emerald-600 text-white"
                                  : "bg-gray-200 text-gray-600"
                              }`}
                            >
                              {session.device_type === "mobile" ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                                  <path d="M12 18h.01" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <circle cx="12" cy="12" r="10" />
                                  <circle cx="12" cy="12" r="4" />
                                  <line x1="21.17" x2="12" y1="8" y2="8" />
                                  <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
                                  <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
                                </svg>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-gray-900">
                                {session.device || "Perangkat Web"}
                              </p>
                              <p className="truncate text-[10px] text-gray-500">
                                {session.platform ||
                                  (session.ip_address
                                    ? `IP ${session.ip_address}`
                                    : "Sesi Portal M-Class")}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-2">
                            <span className="flex items-center gap-1 text-[10px] text-gray-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 6v6l4 2" />
                              </svg>
                              {isCurrent ? "Sekarang" : formatSessionDate(session.created_at)}
                            </span>
                            {isCurrent && (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"></span>
                                Sesi Aktif Saat Ini
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="relative rounded-lg border border-emerald-200 bg-emerald-50/40 p-3">
                      <div className="flex items-start gap-2.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <circle cx="12" cy="12" r="4" />
                            <line x1="21.17" x2="12" y1="8" y2="8" />
                            <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
                            <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-gray-900">Peramban Web Aktif</p>
                          <p className="text-[10px] text-gray-500">Sesi portal M-Class saat ini</p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-2">
                        <span className="flex items-center gap-1 text-[10px] text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 6v6l4 2" />
                          </svg>
                          Sekarang
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"></span>
                          Sesi Aktif Saat Ini
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ==================== RIGHT COLUMN ==================== */}
            <div className="flex flex-col gap-4">
              {/* ==== DATA DIRI ==== */}
              <div className="rounded-xl border border-gray-200 bg-white p-5 transition-all duration-300 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-gray-900">
                      Data Diri & Kedinasan Admin
                    </h3>
                    <span className="text-red-500">*</span>
                  </div>
                  <span className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-[10px] font-mono text-gray-600">
                    ID Petugas: {profile.staffCode}
                  </span>
                </div>
                <p className="mt-0.5 text-[10px] text-gray-500">
                  Informasi identitas petugas pendidik dan tenaga kependidikan madrasah.
                </p>

                <div className="mt-4 space-y-4">
                  <div>
                    <label className="mb-1 block text-[10px] font-bold tracking-wide text-gray-600">
                      NAMA LENGKAP & GELAR <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="profile-name"
                      type="text"
                      value={profile.nama}
                      onChange={(e) => handleProfileChange("name", e.target.value)}
                      aria-invalid={Boolean(getFieldError("name"))}
                      aria-describedby={getFieldError("name") ? "profile-name-error" : undefined}
                      disabled={isLoadingProfile || isSavingProfile}
                      className={`w-full rounded-lg border bg-gray-50 px-3 py-2 text-xs text-gray-800 focus:bg-white focus:outline-none focus:ring-1 transition-colors disabled:cursor-not-allowed disabled:opacity-70 ${
                        getFieldError("name")
                          ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                      }`}
                    />
                    {getFieldError("name") && (
                      <p id="profile-name-error" role="alert" className="mt-1 text-[10px] text-red-600">
                        {getFieldError("name")}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-[10px] font-bold tracking-wide text-gray-600">
                      ALAMAT EMAIL RESMI MADRASAH <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect width="20" height="16" x="2" y="4" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                      </span>
                      <input
                        id="profile-email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => handleProfileChange("email", e.target.value)}
                        aria-invalid={Boolean(getFieldError("email"))}
                        aria-describedby={getFieldError("email") ? "profile-email-error" : undefined}
                        disabled={isLoadingProfile || isSavingProfile}
                        className={`w-full rounded-lg border bg-gray-50 py-2 pl-9 pr-3 text-xs text-gray-800 focus:bg-white focus:outline-none focus:ring-1 transition-colors disabled:cursor-not-allowed disabled:opacity-70 ${
                          getFieldError("email")
                            ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                        }`}
                      />
                    </div>
                    {getFieldError("email") ? (
                      <p id="profile-email-error" role="alert" className="mt-1 text-[10px] text-red-600">
                        {getFieldError("email")}
                      </p>
                    ) : (
                      <p className="mt-1 flex items-center gap-1 text-[10px] text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 16v-4M12 8h.01" />
                        </svg>
                        Digunakan untuk notifikasi resmi & verifikasi akun petugas.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-[10px] font-bold tracking-wide text-gray-600">
                      PERAN SISTEM (ROLE) <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center justify-between rounded-lg border border-gray-300 bg-gray-50 px-3 py-2">
                      <span className="text-xs text-gray-800">{profile.role}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                    <p className="mt-1 flex items-center gap-1 text-[10px] text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4M12 8h.01" />
                      </svg>
                      Peran hanya dapat diubah oleh Super Admin Madrasah.
                    </p>
                  </div>
                </div>
              </div>

              {/* ==== KREDENSIAL AKSES LOGIN ==== */}
              <div className="rounded-xl border border-gray-200 bg-white p-5 transition-all duration-300 hover:shadow-md">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="7.5" cy="15.5" r="5.5" />
                      <path d="m21 2-9.6 9.6" />
                      <path d="m15.5 7.5 3 3L22 7l-3-3" />
                    </svg>
                  </span>
                  <h3 className="text-base font-bold text-gray-900">
                    Kredensial Akses Login
                  </h3>
                </div>
                <p className="mt-0.5 text-[10px] text-gray-500">
                  Pengaturan kata sandi dan akun portal admin.
                </p>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-[10px] font-bold tracking-wide text-gray-600">
                      KATA SANDI SAAT INI
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => {
                          setCurrentPassword(e.target.value);
                          setFieldErrors((prev) => ({
                            ...prev,
                            current_password: undefined,
                          }));
                        }}
                        placeholder="••••••••"
                        className={`w-full rounded-lg border bg-gray-50 px-3 py-2 pr-9 text-xs text-gray-800 focus:bg-white focus:outline-none focus:ring-1 transition-colors ${
                          getFieldError("current_password")
                            ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword((v) => !v)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                    </div>
                    {getFieldError("current_password") && (
                      <p className="mt-1 text-[10px] text-red-600">
                        {getFieldError("current_password")}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-[10px] font-bold tracking-wide text-gray-600">
                      KATA SANDI BARU (OPSIONAL)
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          setFieldErrors((prev) => ({
                            ...prev,
                            new_password: undefined,
                          }));
                        }}
                        placeholder="Kosongkan jika tidak diganti"
                        className={`w-full rounded-lg border bg-gray-50 px-3 py-2 pr-9 text-xs text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-1 transition-colors ${
                          getFieldError("new_password")
                            ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((v) => !v)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                    </div>
                    {getFieldError("new_password") && (
                      <p className="mt-1 text-[10px] text-red-600">
                        {getFieldError("new_password")}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* ==== ACTION BAR ==== */}
              <div className="flex flex-col items-start justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-all duration-300 hover:shadow-md sm:flex-row sm:items-center">
                <p className="text-[10px] text-gray-500">
                  Setiap perubahan data dicatat ke dalam audit log keamanan madrasah.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetChanges}
                    disabled={isLoadingProfile || isSavingProfile}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-70"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSimpanPerubahan}
                    disabled={isLoadingProfile || isSavingProfile}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-emerald-800 hover:shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoadingProfile ? "Memuat profil..." : isSavingProfile ? "Menyimpan..." : "Simpan perubahan"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* MODALS & TOAST */}
          <ModalGantiFoto
            isOpen={showFotoModal}
            onClose={() => setShowFotoModal(false)}
            onConfirm={handleSimpanFoto}
            onDeleteCurrent={fotoProfil ? handleHapusFoto : undefined}
            user={{
              nama: profile.nama,
              avatarSeed: avatarInitials,
              photoUrl: fotoProfil,
            }}
          />

          <ModalHapusFoto
            isOpen={showHapusModal}
            onClose={() => setShowHapusModal(false)}
            onConfirm={handleHapusFoto}
            isLoading={isDeleting}
            user={{
              nama: profile.nama,
              idPetugas: profile.staffCode,
              avatarSeed: avatarInitials,
              photoUrl: fotoProfil,
            }}
          />

          <Toast
            isOpen={toast.open}
            onClose={() => setToast({ ...toast, open: false })}
            title={toast.title}
            message={toast.message}
            type={toast.type}
          />

        </main>
    </DashboardLayout>
  );
}
