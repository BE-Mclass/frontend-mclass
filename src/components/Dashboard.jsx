import { Link } from "react-router-dom";
import { useState } from "react";
import DashboardLayout from "./dashboard/DashboardLayout";
import StatCard from "./dashboard/StatCard";
import ClassCard from "./dashboard/ClassCard";
import AnnouncementList from "./dashboard/AnnouncementList";
import CalendarWidget from "./dashboard/CalendarWidget";

const stats = [
  {
    label: "TOTAL SISWA",
    value: "30",
    unit: "Siswa",
    subtext: "100% Terdaftar",
    subColor: "text-emerald-600",
    variant: "default",
  },
  {
    label: "SUDAH HADIR",
    value: "27",
    unit: "90%",
    subtext: "+3 vs kemarin",
    subColor: "text-emerald-600",
    variant: "success",
  },
  {
    label: "TERLAMBAT / IZIN",
    value: "2",
    unit: "Siswa",
    subtext: "1 Izin, 1 Telat Sesi 1",
    subColor: "text-gray-500",
    variant: "warning",
  },
  {
    label: "BELUM HADIR / ALPA",
    value: "3",
    unit: "Siswa",
    subtext: "Perlu Tindak Lanjut: 3",
    subColor: "text-red-600",
    variant: "danger",
  },
];

const classes = [
  {
    kelasId: "7",
    className: "Kelas 7",
    totalStudents: 10,
    present: 10,
    absent: 0,
    percent: 100,
    note: null,
  },
  {
    kelasId: "8",
    className: "Kelas 8",
    totalStudents: 10,
    present: 9,
    absent: 1,
    percent: 90,
    note: "1 belum hadir",
  },
  {
    kelasId: "9",
    className: "Kelas 9",
    totalStudents: 10,
    present: 8,
    absent: 2,
    percent: 80,
    note: "2 belum hadir",
  },
];

export default function Dashboard() {
  const [lastSync] = useState("07.30 WIB");

  return (
    <DashboardLayout>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">

          {/* Page Header - Animasi Masuk */}
          <div className="animate-item delay-100 mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">
                Dashboard Pemantauan Presensi Harian
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Monitoring kehadiran siswa real-time MTs Al-Ma'arif O2 Singosari
              </p>
            </div>
          </div>

          {/* Stat Cards - Animasi Masuk */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <div key={i} className="animate-item delay-200">
                <StatCard {...s} />
              </div>
            ))}
          </div>

          {/* Monitoring Section - Animasi Masuk */}
          <div className="animate-item delay-300 mt-6">
            <div className="mb-3 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Monitoring per Tingkat Kelas
                </h3>
                <p className="mt-0.5 text-xs text-gray-500">
                  Status kehadiran per tingkat kelas pada jam pemantauan berjalan saat ini
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {classes.map((c, i) => (
                <div key={i} className="transition-transform duration-300 hover:-translate-y-1">
                  <ClassCard {...c} />
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Grid - Animasi Masuk */}
          <div className="animate-item delay-400 mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_1fr]">
            <AnnouncementList />
            <CalendarWidget />
          </div>

        </main>
    </DashboardLayout>
  );
}