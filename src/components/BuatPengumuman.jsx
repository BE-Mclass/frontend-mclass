import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "./dashboard/Sidebar";
import Topbar from "./dashboard/Topbar";
import ModalTerbitkan from "./ModalTerbitkan";
import Toast from "./Toast";
import { createAnnouncement } from "../services/announcementService";

// ============ DATA FORM ============
const jenisPengumuman = [
  { label: "Akademik", value: "akademik" },
  { label: "Kegiatan", value: "kegiatan" },
  { label: "Libur / Cuti", value: "libur" },
  { label: "Penting", value: "penting" },
  { label: "Prestasi", value: "prestasi" },
  { label: "Info", value: "info" },
];

const targetAudiens = [
  { label: "Semua", value: "semua" },
  { label: "Siswa", value: "siswa" },
  { label: "Guru", value: "guru" },
  { label: "Wali Murid", value: "wali" },
];

export default function BuatPengumuman() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    jenis: "penting",
    judul: "",
    tanggal: "2026-10-23",
    target: "semua",
    prioritas: "penting",
    deskripsi: "",
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    title: "",
    message: "",
    type: "success",
  });

  const handlePublish = async () => {
    setIsPublishing(true);

    try {
      await createAnnouncement(formData);
      setShowConfirmModal(false);
      setToast({
        open: true,
        title: "Pengumuman berhasil diterbitkan",
        message: "Pengumuman telah disimpan.",
        type: "success",
      });

      setTimeout(() => navigate("/kalender"), 1200);
    } catch (error) {
      const fieldErrors = error.errors
        ? Object.values(error.errors).join(" ")
        : "";

      setShowConfirmModal(false);
      setToast({
        open: true,
        title: "Pengumuman gagal diterbitkan",
        message: fieldErrors || error.message || "Terjadi kesalahan.",
        type: "error",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-6">

          {/* Header - Animasi Masuk */}
          <div className="animate-item delay-100 mt-3 mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <Link
                to="/kalender"
                className="mt-1 flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m12 19-7-7 7-7M19 12H5" />
                </svg>
              </Link>
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">
                  Buat Pengumuman Baru
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Tulis pengumuman baru untuk dipublikasikan ke seluruh audiens yang dipilih.
                </p>
              </div>
            </div>
          </div>

          {/* FORM & PREVIEW - Animasi Masuk */}
          <div className="animate-item delay-200 grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">

            {/* KIRI: FORM */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Form Buat Pengumuman
                  </h3>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Isi form di bawah dengan lengkap dan benar.
                  </p>
                </div>
                <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                  Draft
                </span>
              </div>

              <form
                className="mt-4 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();

                  if (
                    !formData.judul.trim() ||
                    !formData.deskripsi.trim() ||
                    !formData.tanggal
                  ) {
                    setToast({
                      open: true,
                      title: "Form belum lengkap",
                      message: "Judul, tanggal, dan deskripsi wajib diisi.",
                      type: "error",
                    });
                    return;
                  }

                  setShowConfirmModal(true);
                }}
              >
                {/* Jenis Pengumuman */}
                <div>
                  <label className="mb-1 block text-[11px] font-bold text-gray-700">
                    Jenis Pengumuman <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.jenis}
                    onChange={(e) => setFormData({ ...formData, jenis: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                  >
                    {jenisPengumuman.map((j) => (
                      <option key={j.value} value={j.value}>{j.label}</option>
                    ))}
                  </select>
                </div>

                {/* Judul */}
                <div>
                  <label className="mb-1 block text-[11px] font-bold text-gray-700">
                    Judul Pengumuman <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.judul}
                    onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                    placeholder="Contoh: Perubahan Jadwal Ujian PTS Ganjil"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                </div>

                {/* Tanggal */}
                <div>
                  <label className="mb-1 block text-[11px] font-bold text-gray-700">
                    Tanggal Publikasi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.tanggal}
                    onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                </div>

                {/* Target Audiens */}
                <div>
                  <label className="mb-1 block text-[11px] font-bold text-gray-700">
                    Target Audiens <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                  >
                    {targetAudiens.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                {/* Prioritas */}
                <div>
                  <label className="mb-1 block text-[11px] font-bold text-gray-700">
                    Prioritas <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {["Rendah", "Normal", "Penting", "Urgent"].map((p) => {
                      const val = p.toLowerCase();
                      const active = formData.prioritas === val;
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setFormData({ ...formData, prioritas: val })}
                          className={`rounded-md border px-2.5 py-1 text-[10px] font-semibold transition-all ${
                            active
                              ? "border-emerald-600 bg-emerald-700 text-white shadow-sm"
                              : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Deskripsi */}
                <div>
                  <label className="mb-1 block text-[11px] font-bold text-gray-700">
                    Deskripsi Pengumuman <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={6}
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                    placeholder="Tuliskan isi pengumuman secara lengkap dan jelas..."
                    className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                  ></textarea>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 border-t border-gray-100 pt-4">
                  <button
                    type="submit"
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-700 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 hover:shadow-md active:scale-[0.98] transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m22 2-7 20-4-9-9-4Z" />
                      <path d="M22 2 11 13" />
                    </svg>
                    Terbitkan Pengumuman
                  </button>
                </div>
              </form>
            </div>

            {/* KANAN: PREVIEW & TIPS */}
            <div className="space-y-4">
              <div className="rounded-xl border border-gray-200 bg-white p-5 transition-all duration-300 hover:shadow-md">
                <h3 className="text-sm font-bold text-gray-900">Preview Pengumuman</h3>
                <p className="mt-0.5 text-[10px] text-gray-500">Tampilan pengumuman setelah diterbitkan</p>

                <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50/50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      {formData.jenis.charAt(0).toUpperCase() + formData.jenis.slice(1)}
                    </span>
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        formData.prioritas === "urgent"
                          ? "bg-red-100 text-red-700"
                          : formData.prioritas === "penting"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {formData.prioritas.charAt(0).toUpperCase() + formData.prioritas.slice(1)}
                    </span>
                  </div>

                  <h4 className="mt-2 text-xs font-bold text-gray-900">
                    {formData.judul || <span className="italic text-gray-400">(Judul belum diisi)</span>}
                  </h4>

                  <p className="mt-1 line-clamp-4 text-[10px] leading-relaxed text-gray-500">
                    {formData.deskripsi || <span className="italic">(Deskripsi belum diisi)</span>}
                  </p>

                  <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-2 text-[9px] text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                    <span>Baru saja</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-5 transition-all duration-300 hover:shadow-md">
                <div className="flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4M12 8h.01" />
                    </svg>
                  </span>
                  <h4 className="text-[11px] font-bold text-emerald-800">Tips Menulis Pengumuman</h4>
                </div>
                <ul className="mt-3 space-y-1.5 text-[10px] text-emerald-800">
                  <li className="flex items-start gap-1.5">
                    <span className="mt-0.5">•</span>
                    <span>Gunakan judul yang singkat & jelas (max 80 karakter)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="mt-0.5">•</span>
                    <span>Sebutkan waktu, tempat, dan siapa yang terlibat</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="mt-0.5">•</span>
                    <span>Pilih prioritas <strong>Penting</strong> untuk info mendesak</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="mt-0.5">•</span>
                    <span>Cek sekali lagi sebelum klik "Terbitkan"</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* MODAL KONFIRMASI */}
          <ModalTerbitkan
            isOpen={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            onConfirm={handlePublish}
            data={formData}
            isLoading={isPublishing}
          />

          {/* TOAST NOTIFICATION */}
          <Toast
            isOpen={toast.open}
            onClose={() => setToast({ ...toast, open: false })}
            title={toast.title}
            message={toast.message}
            type={toast.type}
          />

          {/* Footer - Animasi Masuk */}
          <footer className="animate-item delay-400 mt-6 flex items-center justify-center border-t border-gray-200 pt-4 text-[10px] text-gray-400">
            <span>© 2026 MTs Al-Ma'arif O2 Singosari • Sistem Presensi Digital Terpadu</span>
          </footer>
        </main>
      </div>
    </div>
  );
}