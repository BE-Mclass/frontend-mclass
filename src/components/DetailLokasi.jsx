import { Link } from "react-router-dom";
import DashboardLayout from "./dashboard/DashboardLayout";

// ============ DATA TITIK LOKASI ============
const lokasiData = [
];

// ============ SISWA DI LUAR RADIUS ============
const siswaDiLuarRadius = [
  {
    nama: "Joko Widodo",
    kelas: "8",
    jarak: "72 m dari pusat",
    waktu: "06:45 WIB",
    lokasi: "Jl. Raya Singosari",
  },
  {
    nama: "Irfan Bachdim",
    kelas: "9",
    jarak: "65 m dari pusat",
    waktu: "06:50 WIB",
    lokasi: "Pasar Singosari",
  },
  {
    nama: "Jack Brown",
    kelas: "9",
    jarak: "80 m dari pusat",
    waktu: "06:55 WIB",
    lokasi: "Jl. Rogonoto",
  },
];

// ============ ICON MAP ============
const icons = {
  pin: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  user: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  warning: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" x2="12" y1="9" y2="13" />
      <line x1="12" x2="12.01" y1="17" y2="17" />
    </svg>
  ),
  external: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" x2="21" y1="14" y2="3" />
    </svg>
  ),
};

// ============ MAP URL ============
const MAP_EMBED_URL =
  "https://www.google.com/maps?q=MTs+Almaarif+02+Singosari+Malang&output=embed";

const MAP_LINK_URL = "https://maps.app.goo.gl/tL6EP7p2YU76x2mW7";

export default function DetailLokasi() {
  return (
    <DashboardLayout>
        <main className="flex-1 overflow-y-auto p-6">

          {/* Header - Animasi Masuk */}
          <div className="animate-item delay-100 mt-3 mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
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
                  Detail Titik Lokasi Presensi
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Pemantauan geolokasi presensi siswa & petugas di lingkungan MTs Al-Ma'arif 02 Singosari
                </p>
              </div>
            </div>
            <a
              href={MAP_LINK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-800 transition-colors"
            >
              {icons.external}
              Buka di Google Maps
            </a>
          </div>

          {/* 2 STAT CARDS - Animasi Masuk */}
          <div className="animate-item delay-200 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-4 border-l-4 border-l-blue-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold tracking-wide text-gray-600">
                    Siswa Terpantau
                  </p>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold text-gray-900">30</span>
                    <span className="text-xs font-semibold text-gray-500">Siswa</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Dalam radius geofence</p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  {icons.user}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 border-l-4 border-l-red-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold tracking-wide text-gray-600">
                    Di Luar Radius
                  </p>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold text-red-600">3</span>
                    <span className="text-xs font-semibold text-gray-500">Siswa</span>
                  </div>
                  <p className="mt-1 text-xs text-red-600">Perlu tindak lanjut</p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600">
                  {icons.warning}
                </div>
              </div>
            </div>
          </div>

          {/* PETA FULL WIDTH - Animasi Masuk */}
          <div className="animate-item delay-300 mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:shadow-md">
            <div className="flex flex-col items-start justify-between gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  Peta Geofence Presensi
                </h3>
                <p className="mt-0.5 text-[10px] text-gray-500">
                  MTs Al-Ma'arif 02 Singosari, Kabupaten Malang • Radius aktif: 50 meter
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 md:flex">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"></span>
                  Live Tracking
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  Radius 50m
                </span>
              </div>
            </div>

            {/* Google Maps iframe */}
            <div className="relative h-[500px] w-full bg-gray-100">
              <iframe
                title="Peta MTs Al-Ma'arif 02 Singosari"
                src={MAP_EMBED_URL}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              ></iframe>
            </div>

            {/* Footer info */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 p-4">
              <div className="flex items-center gap-2">
                <span className="text-emerald-700">{icons.pin}</span>
                <div>
                  <p className="text-xs font-bold text-gray-900">
                    MTs Al-Ma'arif 02 Singosari
                  </p>
                  <p className="text-[10px] text-gray-500">
                    Jl. Sidomulyo No.98, Panggung, Kec. Singosari, Kabupaten Malang, Jawa Timur 65153
                  </p>
                </div>
              </div>
              <p className="text-[10px] text-gray-400">
                Koordinat pusat: -7.8898, 112.6632
              </p>
            </div>
          </div>

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              {lokasiData.map((l) => (
                <div
                  key={l.id}
                  className={`rounded-lg border p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-sm ${
                    l.status === "aktif"
                      ? "border-emerald-100 bg-emerald-50/40"
                      : "border-amber-100 bg-amber-50/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-gray-900">{l.nama}</p>
                      <p className="mt-0.5 text-[10px] text-gray-500">{l.alamat}</p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold ${
                        l.status === "aktif"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {l.status === "aktif" ? "AKTIF" : "PERLU CEK"}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-1.5 text-center">
                    <div className="rounded bg-white py-1.5">
                      <p className="text-[9px] text-gray-500">Radius</p>
                      <p className="text-xs font-bold text-gray-800">{l.radius}m</p>
                    </div>
                    <div className="rounded bg-white py-1.5">
                      <p className="text-[9px] text-gray-500">Terpantau</p>
                      <p className="text-xs font-bold text-gray-800">{l.siswaTerpantau}</p>
                    </div>
                    <div className="rounded bg-white py-1.5">
                      <p className="text-[9px] text-gray-500">Luar</p>
                      <p
                        className={`text-xs font-bold ${
                          l.siswaDiLuar > 0 ? "text-red-600" : "text-gray-800"
                        }`}
                      >
                        {l.siswaDiLuar}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          {/* TABEL SISWA DI LUAR RADIUS - Animasi Masuk */}
          <section className="animate-item delay-400 mt-4 rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:shadow-md">
            <div className="flex flex-col items-start justify-between gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center">
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-red-500">{icons.warning}</span>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Siswa Terdeteksi di Luar Radius
                  </h3>
                  <p className="mt-0.5 text-[10px] text-gray-500">
                    Daftar siswa yang melakukan presensi di luar radius geofence
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-red-100 px-2.5 py-1 text-[10px] font-bold text-red-700">
                {siswaDiLuarRadius.length} Siswa
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    <th className="px-4 py-3 text-left">Nama Siswa</th>
                    <th className="px-4 py-3 text-center">Kelas</th>
                    <th className="px-4 py-3 text-center">Jarak</th>
                    <th className="px-4 py-3 text-center">Waktu</th>
                    <th className="px-4 py-3 text-left">Lokasi Terdeteksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {siswaDiLuarRadius.map((s, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {s.nama}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                          {s.kelas}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-red-600">
                        {s.jarak}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-700">
                        {s.waktu}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{s.lokasi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

        </main>
    </DashboardLayout>
  );
}