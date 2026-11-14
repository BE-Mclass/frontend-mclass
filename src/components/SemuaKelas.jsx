import { Link } from "react-router-dom";
import DashboardLayout from "./dashboard/DashboardLayout";

// Data 9 kelas dengan berbagai status
const allClasses = [
  { id: "7A", grade: 7, totalStudents: 30, present: 30, izin: 0, telat: 0, alpa: 0, percent: 100, status: "normal" },
  { id: "7B", grade: 7, totalStudents: 30, present: 28, izin: 1, telat: 0, alpa: 1, percent: 93.3, status: "warning" },
  { id: "7C", grade: 7, totalStudents: 30, present: 30, izin: 0, telat: 0, alpa: 0, percent: 100, status: "normal" },
  { id: "8A", grade: 8, totalStudents: 32, present: 30, izin: 1, telat: 0, alpa: 1, percent: 93.8, status: "warning" },
  { id: "8B", grade: 8, totalStudents: 30, present: 28, izin: 0, telat: 1, alpa: 1, percent: 93.3, status: "warning" },
  { id: "8C", grade: 8, totalStudents: 28, present: 26, izin: 1, telat: 0, alpa: 1, percent: 92.9, status: "warning" },
  { id: "9A", grade: 9, totalStudents: 32, present: 32, izin: 0, telat: 0, alpa: 0, percent: 100, status: "normal" },
  { id: "9B", grade: 9, totalStudents: 30, present: 28, izin: 1, telat: 1, alpa: 0, percent: 93.3, status: "warning" },
  { id: "9C", grade: 9, totalStudents: 28, present: 22, izin: 1, telat: 1, alpa: 4, percent: 78.6, status: "danger" },
];

const statusStyles = {
  normal: {
    card: "border-gray-200 bg-white",
    badge: "bg-emerald-100 text-emerald-700",
    bar: "bg-emerald-500",
    label: "Kelas Ini",
    labelColor: "text-gray-500",
  },
  warning: {
    card: "border-amber-200 bg-amber-50/30",
    badge: "bg-amber-100 text-amber-700",
    bar: "bg-amber-500",
    label: "Perlu Cek",
    labelColor: "text-amber-600",
  },
  danger: {
    card: "border-red-200 bg-red-50/40",
    badge: "bg-red-100 text-red-700",
    bar: "bg-red-500",
    label: "Tindak Lanjut",
    labelColor: "text-red-600",
  },
};

export default function AllClasses() {
  // Group by grade
  const grades = [7, 8, 9];

  return (
    <DashboardLayout
      footer={
        <footer className="flex shrink-0 items-center justify-between border-t border-gray-200 px-6 py-4 text-[10px] text-gray-400">
          <span>
            © 2026 MTs Al-Ma'arif O2 Singosari • Sistem Presensi Digital Terpadu
          </span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-gray-600">Bantuan Teknis</a>
            <a href="#" className="hover:text-gray-600">Kebijakan Privasi</a>
            <div className="flex items-center gap-1.5 text-emerald-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span className="font-medium">Server Terhubung</span>
            </div>
          </div>
        </footer>
      }
    >
        <main className="flex-1 overflow-y-auto p-6">
         {/* Breadcrumb */}
<div className="flex items-center gap-2 text-xs text-gray-500">
  <Link to="/dashboard" className="hover:text-emerald-700">Dashboard</Link>
  <span>›</span>
  <Link to="/rekap-kelas" className="hover:text-emerald-700">Rekap Kelas</Link>
  <span>›</span>
  <span className="font-semibold text-gray-700">Semua Kelas</span>
</div>

          {/* Summary Bar */}
          <div className="mb-5 flex flex-wrap items-center gap-4 rounded-xl border border-gray-200 bg-white px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-medium text-gray-700">
                6 Kelas Normal
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
              <span className="text-xs font-medium text-gray-700">
                2 Kelas Perlu Cek
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>
              <span className="text-xs font-medium text-gray-700">
                1 Kelas Tindak Lanjut
              </span>
            </div>
            <div className="ml-auto flex items-center gap-2 text-xs text-gray-500">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
              Update terakhir: <strong className="text-gray-700">07:30 WIB</strong>
            </div>
          </div>

          {/* Group per grade */}
          {grades.map((grade) => {
            const classesInGrade = allClasses.filter((c) => c.grade === grade);
            const totalPresent = classesInGrade.reduce((sum, c) => sum + c.present, 0);
            const totalStudents = classesInGrade.reduce((sum, c) => sum + c.totalStudents, 0);
            const gradePercent = ((totalPresent / totalStudents) * 100).toFixed(1);

            return (
              <section key={grade} className="mb-6">
                {/* Grade Header */}
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-gray-900">
                      Kelas {grade}
                    </h3>
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600">
                      {classesInGrade.length} KELAS
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-gray-500">
                      Total: <strong className="text-gray-800">{totalPresent}/{totalStudents}</strong> siswa
                    </span>
                    <span
                      className={`rounded-md px-2 py-0.5 font-bold ${
                        parseFloat(gradePercent) >= 95
                          ? "bg-emerald-100 text-emerald-700"
                          : parseFloat(gradePercent) >= 85
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {gradePercent}%
                    </span>
                  </div>
                </div>

                {/* Class Grid */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {classesInGrade.map((c) => {
                    const style = statusStyles[c.status];
                    return (
                      <div
                        key={c.id}
                        className={`rounded-xl border p-4 transition hover:shadow-md ${style.card}`}
                      >
                        {/* Header: Nama kelas + status */}
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-bold text-gray-900">
                            {c.id}
                          </h4>
                          <span className={`text-xs font-semibold ${style.labelColor}`}>
                            {style.label}
                          </span>
                        </div>

                        {/* Angka utama */}
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-2xl font-extrabold text-gray-900">
                            {c.present}
                            <span className="text-sm font-medium text-gray-400">
                              {" "}
                              / {c.totalStudents}
                            </span>
                          </span>
                          <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${style.badge}`}>
                            {c.percent}%
                          </span>
                        </div>

                        {/* Progress bar */}
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-[10px] text-gray-500">
                            <span>{c.percent}% Hadir</span>
                            <span>{c.alpa} Alpa</span>
                          </div>
                          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                            <div
                              className={`h-full rounded-full ${style.bar}`}
                              style={{ width: `${c.percent}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Breakdown izin/telat/alpa */}
                        <div className="mt-3 grid grid-cols-3 gap-1.5 text-center">
                          <div className="rounded-md bg-gray-50 py-1.5">
                            <p className="text-[10px] text-gray-500">Izin</p>
                            <p className="text-sm font-bold text-gray-800">{c.izin}</p>
                          </div>
                          <div className="rounded-md bg-gray-50 py-1.5">
                            <p className="text-[10px] text-gray-500">Telat</p>
                            <p className="text-sm font-bold text-gray-800">{c.telat}</p>
                          </div>
                          <div className="rounded-md bg-gray-50 py-1.5">
                            <p className="text-[10px] text-gray-500">Alpa</p>
                            <p className={`text-sm font-bold ${c.alpa > 0 ? "text-red-600" : "text-gray-800"}`}>
                              {c.alpa}
                            </p>
                          </div>
                        </div>

                        {/* CTA */}
                        <button className="mt-3 w-full rounded-lg border border-gray-200 bg-white py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50">
                          Lihat Detail Presensi
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}

        </main>
    </DashboardLayout>
  );
}