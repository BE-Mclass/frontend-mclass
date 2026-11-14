export default function ModalHapusFoto({
  isOpen,
  onClose,
  onConfirm,
  user,
  isDeleting,
  isLoading,
}) {
  if (!isOpen) return null;

  const busy = Boolean(isDeleting || isLoading);

  const userData = {
    nama: user?.nama || user?.name || "Petugas Madrasah",
    idPetugas: user?.idPetugas || user?.staff_code || "AGR-001",
    unit: user?.unit || "MTs Al-Ma'arif 02",
    avatarSeed:
      user?.avatarSeed ||
      (user?.nama || user?.name || "PM")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") ||
      "PM",
    photoUrl: user?.photoUrl || null,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop dengan animasi fade-in */}
      <div
        className="animate-backdrop absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
        onClick={busy ? undefined : onClose}
      ></div>

      {/* Modal Container dengan animasi scale-up */}
      <div className="animate-modal relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="10" x2="10" y1="11" y2="17" />
                <line x1="14" x2="14" y1="11" y2="17" />
              </svg>
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-wide text-red-600">
                KONFIRMASI HAPUS FOTO
              </div>
              <h2 className="mt-1 text-lg font-extrabold text-gray-900">
                Hapus Foto Profil?
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={busy}
            className="rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
            aria-label="Tutup"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          <p className="text-xs leading-relaxed text-gray-600">
            Foto profil saat ini akan dihapus dan digantikan dengan{" "}
            <strong className="text-gray-900">avatar default</strong> berisi
            inisial nama Anda. Tindakan ini dapat dibatalkan dengan mengunggah
            foto baru kapan saja.
          </p>

          {/* Preview avatar saat ini */}
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-white shadow">
              {userData.photoUrl ? (
                <img
                  src={userData.photoUrl}
                  alt={userData.nama}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-emerald-700 text-base font-extrabold text-white">
                  {userData.avatarSeed}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-gray-900">
                {userData.nama}
              </p>
              <p className="truncate text-[10px] text-gray-500">
                {userData.idPetugas} • {userData.unit}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold ${
                userData.photoUrl
                  ? "bg-red-100 text-red-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {userData.photoUrl ? "FOTO AKTIF" : "BELUM ADA FOTO"}
            </span>
          </div>

          {/* Info replace dengan avatar default */}
          <div className="mt-3 flex items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-white p-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-gray-700">
                Avatar Default
              </p>
              <p className="text-[10px] text-gray-500">
                Inisial nama otomatis dari sistem madrasah
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[9px] font-bold text-gray-600">
              AKAN DITERAPKAN
            </span>
          </div>

          {/* Warning */}
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <line x1="12" x2="12" y1="9" y2="13" />
              <line x1="12" x2="12.01" y1="17" y2="17" />
            </svg>
            <p className="text-[10px] leading-relaxed text-amber-800">
              Foto akan hilang dari <strong>kartu RFID, portal wali santri,
              dan halaman presensi</strong>. Disarankan ganti dengan foto baru
              secepatnya untuk kelancaran identifikasi.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 border-t border-gray-100 bg-gray-50/50 p-4">
          <button
            onClick={onClose}
            disabled={busy}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-70"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-red-700 hover:shadow-md active:scale-[0.98] disabled:opacity-70"
          >
            {busy ? (
              <>
                <svg className="h-3.5 w-3.5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Menghapus...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                Ya, Hapus Foto
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
