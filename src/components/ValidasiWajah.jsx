import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import DashboardLayout from "./dashboard/DashboardLayout";
import ModalSetujuiValidasi from "./ModalSetujuiValidasi";
import ModalTolakValidasi from "./ModalTolakValidasi";
import Toast from "./Toast";

// ============ DATA SISWA ============
const SISWA_DATA = {
  "2601001": { nis: "2601001", nama: "Achmad Shodiq", kelas: "7", jenisKelamin: "L", tanggalLahir: "12 Mei 2013", waliMurid: "Bpk. Suryanto", avatarSeed: "achmad" },
  "2601002": { nis: "2601002", nama: "Aisyah Nabila", kelas: "7", jenisKelamin: "P", tanggalLahir: "04 Agustus 2013", waliMurid: "Bpk. Hendra", avatarSeed: "aisyah" },
  "2602001": { nis: "2602001", nama: "Abdul Rahman", kelas: "8", jenisKelamin: "L", tanggalLahir: "05 Mei 2012", waliMurid: "Bpk. Hermawan", avatarSeed: "abdul-rahman" },
  "2603001": { nis: "2603001", nama: "Aang Kunaefi", kelas: "9", jenisKelamin: "L", tanggalLahir: "12 Maret 2011", waliMurid: "Bpk. Suparno", avatarSeed: "aang-kunaefi" },
};

const getSiswa = (nis) => {
  if (SISWA_DATA[nis]) return SISWA_DATA[nis];
  return {
    nis: nis || "2601001",
    nama: "Siswa Tidak Diketahui",
    kelas: "-",
    jenisKelamin: "-",
    tanggalLahir: "-",
    waliMurid: "-",
    avatarSeed: "unknown",
  };
};

const getWajahUrl = (seed, size = 300) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(seed)}&size=${size}&background=047857&color=fff&bold=true`;

// ============ DATA RADIUS ============
const RADIUS_GEOFENCE = 50;
const JARAK_SISWA = 12;

// ============ ICON MAP ============
const icons = {
  check: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  close: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6M9 9l6 6" />
    </svg>
  ),
  user: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  camera: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  ),
  pin: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
};

export default function ValidasiWajah() {
  const { nis } = useParams();
  const siswa = getSiswa(nis);

  const [status, setStatus] = useState("pending");
  const [catatan, setCatatan] = useState("");
  const [preview, setPreview] = useState(null);

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    title: "",
    message: "",
    type: "success",
  });

  const persenRadius = Math.min((JARAK_SISWA / RADIUS_GEOFENCE) * 100, 100);
  const dalamRadius = JARAK_SISWA <= RADIUS_GEOFENCE;

  const handleApprove = () => setShowApproveModal(true);
  const handleConfirmApprove = () => {
    setIsApproving(true);
    setTimeout(() => {
      setIsApproving(false);
      setShowApproveModal(false);
      setStatus("approved");
      setToast({
        open: true,
        title: "Validasi Wajah Berhasil",
        message: `Data biometrik ${siswa.nama} telah diverifikasi dan disimpan.`,
        type: "success",
      });
    }, 800);
  };

  const handleReject = () => setShowRejectModal(true);
  const handleConfirmReject = (alasan) => {
    setIsRejecting(true);
    setTimeout(() => {
      setIsRejecting(false);
      setShowRejectModal(false);
      setCatatan(alasan);
      setStatus("rejected");
      setToast({
        open: true,
        title: "Validasi Ditolak",
        message: `Foto wajah ${siswa.nama} ditolak. Siswa diminta mengunggah ulang.`,
        type: "error",
      });
    }, 800);
  };

  const handleReset = () => {
    setStatus("pending");
    setCatatan("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const tanggalHariIni = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <DashboardLayout>
        <main className="flex-1 overflow-y-auto p-6">

          {/* Header - Animasi Masuk */}
          <div className="animate-item delay-100 mt-3 mb-5 flex items-start gap-3">
            <Link
              to={`/detail-kelas/${siswa.kelas}`}
              className="mt-1 flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m12 19-7-7 7-7M19 12H5" />
              </svg>
            </Link>
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">
                Validasi Foto Wajah
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Verifikasi wajah siswa untuk keperluan presensi biometrik AI
              </p>
            </div>
          </div>

          {/* Info Siswa - Animasi Masuk */}
          <div className="animate-item delay-200 rounded-xl border border-gray-200 bg-white p-5 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                {icons.user}
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-gray-900">{siswa.nama}</h3>
                <p className="mt-0.5 text-xs text-gray-500">
                  NIS: <span className="font-mono text-gray-700">{siswa.nis}</span> •{" "}
                  Kelas <strong className="text-gray-700">{siswa.kelas}</strong> •{" "}
                  {siswa.jenisKelamin === "L" ? "Laki-laki" : "Perempuan"}
                </p>
              </div>
              <span
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                  status === "approved"
                    ? "bg-emerald-50 text-emerald-700"
                    : status === "rejected"
                    ? "bg-red-50 text-red-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    status === "approved"
                      ? "bg-emerald-500"
                      : status === "rejected"
                      ? "bg-red-500"
                      : "bg-amber-500 animate-pulse"
                  }`}
                ></span>
                {status === "approved"
                  ? "Terverifikasi"
                  : status === "rejected"
                  ? "Ditolak"
                  : "Menunggu Validasi"}
              </span>
            </div>
          </div>

          {/* Foto Validasi Hari Ini - Animasi Masuk */}
          <div className="animate-item delay-300 mt-6 rounded-xl border border-gray-200 bg-white p-5 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Foto Wajah Hari Ini</h3>
                <p className="mt-0.5 text-[10px] text-gray-500">
                  Foto yang diambil saat sesi presensi — {tanggalHariIni}
                </p>
              </div>
              <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                VALIDASI
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
              {/* Foto */}
              <div className="flex justify-center lg:justify-start">
                <div className="relative group">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview foto validasi"
                      className="h-72 w-72 rounded-xl border-4 border-amber-100 object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <img
                      src={getWajahUrl(siswa.avatarSeed || siswa.nama, 300)}
                      alt={`Foto validasi ${siswa.nama}`}
                      className="h-72 w-72 rounded-xl border-4 border-amber-100 object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  )}
                  <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-amber-600 px-2.5 py-1 text-[10px] font-bold text-white shadow-lg">
                    {icons.camera}
                    Sesi Hari Ini
                  </span>
                </div>
              </div>

              {/* Detail Foto + Upload */}
              <div className="flex flex-col justify-between gap-4">
                <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-4">
                  <h4 className="text-xs font-bold text-gray-900">Detail Foto</h4>
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Waktu Pengambilan</span>
                      <span className="font-semibold text-gray-800">06:42 WIB</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Lokasi</span>
                      <span className="font-semibold text-gray-800">Kampus MTs Al-Ma'arif 02</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Radius Geofence</span>
                      <span className="font-semibold text-gray-800">{RADIUS_GEOFENCE} meter</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Jarak dari Pusat</span>
                      <span className={`font-semibold ${dalamRadius ? "text-emerald-700" : "text-red-600"}`}>
                        {JARAK_SISWA} meter
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Kualitas Foto</span>
                      <span className="font-semibold text-emerald-700">Baik (HD)</span>
                    </div>
                  </div>

                  {/* Progress Bar Radius */}
                  <div className="mt-3 rounded-lg border border-gray-100 bg-white p-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-700">Radius Terpakai</span>
                      <span className={`text-[10px] font-bold ${dalamRadius ? "text-emerald-700" : "text-red-600"}`}>
                        {JARAK_SISWA} / {RADIUS_GEOFENCE} m
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={`h-full rounded-full ${dalamRadius ? "bg-emerald-500" : "bg-red-500"}`}
                        style={{ width: `${persenRadius}%` }}
                      ></div>
                    </div>
                    <p className={`mt-1.5 flex items-center gap-1 text-[10px] font-semibold ${dalamRadius ? "text-emerald-700" : "text-red-600"}`}>
                      {icons.pin}
                      {dalamRadius ? "Dalam radius geofence (aman)" : "Di luar radius geofence (perlu tindak lanjut)"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Animasi Masuk */}
          <div className="animate-item delay-400 mt-6 flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 transition-all duration-300 hover:shadow-md">
            <p className="text-[10px] text-gray-500">
              {status === "pending"
                ? "Pilih tindakan validasi di sebelah kanan."
                : status === "approved"
                ? "✓ Wajah telah divalidasi dan disetujui."
                : "✗ Validasi ditolak. Siswa akan diminta upload ulang."}
            </p>
            <div className="flex items-center gap-2">
              {status !== "pending" && (
                <button onClick={handleReset} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                  Reset
                </button>
              )}
              <button
                onClick={handleReject}
                disabled={status !== "pending"}
                className="flex items-center gap-1.5 rounded-lg border border-red-300 bg-white px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 hover:shadow-sm active:scale-[0.98] transition-all disabled:cursor-not-allowed disabled:opacity-50"
              >
                {icons.close}
                Tolak Validasi
              </button>
              <button
                onClick={handleApprove}
                disabled={status !== "pending"}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800 hover:shadow-md active:scale-[0.98] transition-all disabled:cursor-not-allowed disabled:opacity-50"
              >
                {icons.check}
                Setujui Validasi
              </button>
            </div>
          </div>

          {/* MODALS & TOAST */}
          <ModalSetujuiValidasi
            isOpen={showApproveModal}
            onClose={() => setShowApproveModal(false)}
            onConfirm={handleConfirmApprove}
            siswa={siswa}
            isLoading={isApproving}
          />
          <ModalTolakValidasi
            isOpen={showRejectModal}
            onClose={() => setShowRejectModal(false)}
            onConfirm={handleConfirmReject}
            siswa={siswa}
            isLoading={isRejecting}
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