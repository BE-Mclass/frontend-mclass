import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import DashboardLayout from "./dashboard/DashboardLayout";

// ============ DATA SISWA ============
const NAMA_KELAS_7 = [
  "Achmad Shodiq", "Aisyah Nabila", "Alamsyah Putra", "Anisa Rahmawati", "Bagus Setiawan",
  "Dewi Lestari", "Fajar Nugraha", "Hendra Wijaya", "Indah Permatasari", "Joko Purnomo",
];

const NAMA_KELAS_8 = [
  "Abdul Rahman", "Bunga Lestari", "Cinta Laura", "Dimas Anggara", "Erika Putri",
  "Fajar Alfian", "Gina Sari", "Hendra Setiawan", "Ika Nurlia", "Joko Widodo",
];

const NAMA_KELAS_9 = [
  "Aang Kunaefi", "Bambang Pamungkas", "Cristian Gonzales", "David Beckham", "Egy Maulana",
  "Firman Utina", "Gede Widiade", "Hendra Bayauw", "Irfan Bachdim", "Jack Brown",
];

// ============ GENERATE SISWA ============
function generateSiswa(namaList, totalAlfa, prefixNis) {
  return namaList.slice(0, 10).map((nama, i) => {
    const isAlfa = i >= 10 - totalAlfa;
    return {
      no: i + 1,
      nis: `${prefixNis}${String(i + 1).padStart(3, "0")}`,
      nama,
      status: isAlfa ? "Alfa" : "Hadir",
      waktu: isAlfa ? "—" : `06:${String(40 + (i % 20)).padStart(2, "0")} WIB`,
      ket: isAlfa ? "Tanpa Keterangan" : "Tepat Waktu",
    };
  });
}

// ============ DATA PER KELAS ============
const KELAS_DATA = {
  "7": {
    wali: "Ustadzah Siti Aisyah, S.Pd.",
    total: 10,
    hadir: 10,
    sakit: 0,
    izin: 0,
    alfa: 0,
    terlambat: 0,
    siswa: generateSiswa(NAMA_KELAS_7, 0, "2601"),
  },
  "8": {
    wali: "Ust. Hasan Basri, M.Pd.",
    total: 10,
    hadir: 9,
    sakit: 0,
    izin: 0,
    alfa: 1,
    terlambat: 0,
    siswa: generateSiswa(NAMA_KELAS_8, 1, "2602"),
  },
  "9": {
    wali: "Ust. Zainal Abidin, S.Ag.",
    total: 10,
    hadir: 8,
    sakit: 0,
    izin: 0,
    alfa: 2,
    terlambat: 0,
    siswa: generateSiswa(NAMA_KELAS_9, 2, "2603"),
  },
};

// ============ STATUS STYLE ============
const statusStyles = {
  Hadir: "bg-emerald-100 text-emerald-700",
  Sakit: "bg-amber-100 text-amber-700",
  Izin: "bg-blue-100 text-blue-700",
  Alfa: "bg-red-100 text-red-700",
  Terlambat: "bg-orange-100 text-orange-700",
};

// ============ ICON MAP ============
const statIcons = {
  check: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  thermometer: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
    </svg>
  ),
  doc: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  ),
  warning: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" x2="12" y1="9" y2="13" />
      <line x1="12" x2="12.01" y1="17" y2="17" />
    </svg>
  ),
  clock: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
};

// ============ SUB COMPONENTS ============
function StatCard({ item }) {
  return (
    <div className={`rounded-xl border border-gray-200 bg-white p-4 border-l-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${item.borderColor}`}>
      <div className="flex items-start justify-between">
        <p className="text-[10px] font-bold tracking-wider text-gray-500">
          {item.label}
        </p>
        <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${item.bgIcon}`}>
          {statIcons[item.icon]}
        </span>
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className={`text-3xl font-extrabold ${item.valueColor}`}>
          {item.value}
        </span>
        {item.total && (
          <span className="text-sm font-semibold text-gray-400">{item.total}</span>
        )}
      </div>
    </div>
  );
}

// ============ MAIN ============
export default function DetailKelas() {
  const { kelas } = useParams();
  const [searchQuery, setSearchQuery] = useState("");

  const currentKelas = kelas || "7";
  const data = KELAS_DATA[currentKelas] || KELAS_DATA["7"];

  const filteredSiswa = data.siswa.filter(
    (s) =>
      s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nis.includes(searchQuery)
  );

  const statsData = [
    {
      label: "HADIR",
      value: String(data.hadir),
      total: `/${data.total}`,
      borderColor: "border-l-emerald-500",
      bgIcon: "bg-emerald-50 text-emerald-600",
      valueColor: "text-emerald-700",
      icon: "check",
    },
    {
      label: "SAKIT",
      value: String(data.sakit),
      borderColor: "border-l-amber-500",
      bgIcon: "bg-amber-50 text-amber-600",
      valueColor: "text-amber-600",
      icon: "thermometer",
    },
    {
      label: "IZIN",
      value: String(data.izin),
      borderColor: "border-l-blue-500",
      bgIcon: "bg-blue-50 text-blue-600",
      valueColor: "text-blue-600",
      icon: "doc",
    },
    {
      label: "ALFA",
      value: String(data.alfa),
      borderColor: "border-l-red-500",
      bgIcon: "bg-red-50 text-red-600",
      valueColor: "text-red-600",
      icon: "warning",
    },
    {
      label: "TERLAMBAT",
      value: String(data.terlambat),
      borderColor: "border-l-amber-500",
      bgIcon: "bg-amber-50 text-amber-600",
      valueColor: "text-amber-600",
      icon: "clock",
    },
  ];

  return (
    <DashboardLayout>
        <main className="flex-1 overflow-y-auto p-6">

          {/* Header - Animasi Masuk */}
          <div className="animate-item delay-100 mt-3 mb-5 flex items-start justify-between">
            <div className="flex items-start gap-3">
              <Link
                to="/rekap-kelas"
                className="mt-1 flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m12 19-7-7 7-7M19 12H5" />
                </svg>
              </Link>
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">
                  Laporan Presensi Kelas {currentKelas}
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Kelola data presensi harian santri kelas {currentKelas} aktif di Madrasah
                </p>
              </div>
            </div>
          </div>

          {/* Info Wali Kelas - Animasi Masuk */}
          <div className="animate-item delay-200 rounded-xl border border-gray-200 bg-white p-5 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-lg font-extrabold text-emerald-700">
                {currentKelas}
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Wali Kelas: {data.wali}
                </h3>
                <p className="mt-0.5 text-xs text-gray-500">
                  Semester Ganjil TA 2026/2027 •{" "}
                  <strong className="text-gray-700">{data.total}</strong> Siswa Terdaftar
                </p>
              </div>
            </div>
          </div>

          {/* 5 Stat Cards - Animasi Masuk */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5 animate-item delay-300 mt-4">
            {statsData.map((s, i) => (
              <StatCard key={i} item={s} />
            ))}
          </div>

          {/* Tabel Siswa - Animasi Masuk */}
          <div className="animate-item delay-400 mt-4 rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 p-4">
              <div className="relative w-full max-w-xs">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama santri atau NIS..."
                  className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-xs text-gray-800 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    <th className="px-4 py-3 text-center">No</th>
                    <th className="px-4 py-3 text-left">NIS</th>
                    <th className="px-4 py-3 text-left">Nama Siswa</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-center">Waktu Presensi</th>
                    <th className="px-4 py-3 text-left">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredSiswa.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-xs text-gray-400">
                        Tidak ada data siswa yang cocok.
                      </td>
                    </tr>
                  ) : (
                    filteredSiswa.map((s) => (
                      <tr key={s.no} className="text-xs hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3 text-center font-medium text-gray-500">{s.no}</td>
                        <td className="px-4 py-3 font-mono text-gray-700">{s.nis}</td>
                        <td className="px-4 py-3 font-semibold text-gray-900">
                          <Link
                            to={`/validasi-wajah/${s.nis}`}
                            className="hover:text-emerald-700 hover:underline transition-colors"
                          >
                            {s.nama}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${statusStyles[s.status]}`}>
                            {s.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center text-gray-700">{s.waktu}</td>
                        <td className="px-4 py-3 text-gray-600">{s.ket}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer Tabel */}
            <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 text-[10px] text-gray-500">
              <span>
                Menampilkan <strong className="text-gray-700">{filteredSiswa.length}</strong> dari{" "}
                <strong className="text-gray-700">{data.total}</strong> siswa
              </span>
            </div>
          </div>

        </main>
    </DashboardLayout>
  );
}