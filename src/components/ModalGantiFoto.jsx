import { useState, useRef, useEffect } from "react";
import Toast from "./Toast";

export default function ModalGantiFoto({
  isOpen,
  onClose,
  onConfirm,
  onDeleteCurrent,
  hasCurrentPhoto,
  user,
}) {
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [zoom, setZoom] = useState(50);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  // State Toast
  const [toast, setToast] = useState({
    open: false,
    title: "",
    message: "",
    type: "warning",
  });

  // Reset state ketika modal ditutup
  useEffect(() => {
    if (!isOpen) {
      setPreview(null);
      setSelectedFile(null);
      setZoom(50);
      setIsSaving(false);
      setToast((prev) => ({ ...prev, open: false }));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const userData = user || {
    nama: "Petugas Admin",
    idPetugas: "AGR-001",
    unit: "MTs Al-Ma'arif",
    avatarSeed: "AD",
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!selectedFile && !preview) {
      setToast({
        open: true,
        title: "Foto Belum Dipilih",
        message: "Silakan pilih foto terlebih dahulu sebelum menyimpan.",
        type: "warning",
      });
      return;
    }

    setIsSaving(true);
    try {
      if (onConfirm) {
        await onConfirm(selectedFile ?? preview);
      }
    } catch (error) {
      setToast({
        open: true,
        title: "Gagal Mengunggah Foto",
        message: error?.message || "Terjadi kesalahan saat mengunggah foto profil.",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!hasCurrentPhoto && !preview) {
      setToast({
        open: true,
        title: "Gagal Menghapus Foto",
        message: "Gagal menghapus foto profil karena Anda belum memasang foto profil.",
        type: "error",
      });
      return;
    }

    if (preview && !hasCurrentPhoto) {
      setPreview(null);
      setSelectedFile(null);
      return;
    }

    if (onDeleteCurrent) {
      onClose();
      onDeleteCurrent();
    }
  };

  const handleReset = () => {
    setPreview(null);
    setSelectedFile(null);
    setZoom(50);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop dengan animasi fade-in */}
      <div
        className="animate-backdrop absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Container dengan animasi scale-up */}
      <div className="animate-modal relative z-10 max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-700 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                <circle cx="12" cy="13" r="3" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-extrabold text-gray-900">
                Perbarui Foto Profil Admin
              </h2>
              <p className="mt-0.5 text-[11px] text-gray-500">
                {userData.nama}
                {userData.idPetugas ? ` • ${userData.idPetugas}` : ""}
                {userData.unit ? ` • ${userData.unit}` : ""}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            aria-label="Tutup"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* === Preview Box === */}
            <div className="rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/30 p-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  VIEWFINDER 1:1
                </span>
                <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  Avatar Bulat
                </span>
              </div>

              {/* Preview image */}
              <div className="mt-3 flex items-center justify-center">
                <div className="relative h-48 w-48 overflow-hidden rounded-full border-4 border-white shadow-lg group">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      style={{ transform: `scale(${1 + zoom / 100})` }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-emerald-700 text-5xl font-extrabold text-white">
                      {userData.avatarSeed}
                    </div>
                  )}
                  {preview && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-2 py-1">
                      <p className="truncate text-center text-[9px] font-medium text-white">
                        Wajah 1:1 Tengah Lingkaran
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Zoom slider */}
              <div className="mt-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3M11 8v6M8 11h6" />
                </svg>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-emerald-200 accent-emerald-600"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3M11 8v6M8 11h6" />
                </svg>
                <span className="w-10 text-right text-[10px] font-semibold text-emerald-700">
                  {zoom}°
                </span>
              </div>
            </div>

            {/* === Upload Box === */}
            <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/50 p-4 transition-colors hover:border-emerald-300">
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                  </svg>
                </div>

                <h4 className="mt-3 text-sm font-bold text-gray-900">
                  Unggah Foto Baru
                </h4>
                <p className="mt-1 text-[10px] text-gray-500">
                  Tarik & lepas file foto ke sini, atau
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-[10px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Jelajahi File Komputer
                </button>

                <p className="mt-3 text-[9px] text-gray-400">
                  Format: JPG, PNG, WebP (Maks. 5MB)
                </p>
              </div>

              {/* Buttons bawah */}
              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-gray-200 pt-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-[10px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                    <circle cx="12" cy="13" r="3" />
                  </svg>
                  Pilih Foto Lain
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-[10px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Avatar Default
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center border-t border-gray-100 bg-gray-50/50 p-4">
          <button
            type="button"
            onClick={handleDelete}
            className="mr-auto flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50"
          >
            Hapus Foto Saat Ini
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-70"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-emerald-800 hover:shadow-md active:scale-[0.98] disabled:opacity-70"
            >
              {isSaving ? (
                <>
                  <svg className="h-3.5 w-3.5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Menyimpan...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Terapkan & Simpan Foto
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* TAMPILKAN TOAST DI SINI */}
      <Toast
        isOpen={toast.open}
        onClose={() => setToast({ ...toast, open: false })}
        title={toast.title}
        message={toast.message}
        type={toast.type}
      />
    </div>
  );
}
