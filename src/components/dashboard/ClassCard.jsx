import { Link } from "react-router-dom";

export default function ClassCard({
  kelasId,
  className,
  totalStudents,
  present,
  absent,
  percent,
  note,
}) {
  const isWarning = percent < 100;

  return (
    <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h4 className="text-base font-bold text-gray-900">{className}</h4>
        <span className={`text-xs font-semibold ${isWarning ? "text-amber-600" : "text-gray-500"}`}>
          {isWarning ? "Perlu Cek" : "Kelas Ini"}
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <span className="text-2xl font-extrabold text-gray-900">
          {present}
          <span className="text-sm font-medium text-gray-400"> / {totalStudents}</span>
        </span>
        <span
          className={`rounded-md px-2 py-0.5 text-xs font-bold ${
            isWarning
              ? "bg-amber-100 text-amber-700"
              : "bg-emerald-100 text-emerald-700"
          }`}
        >
          {percent}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-[10px] text-gray-500">
          <span>{percent}% Hadir</span>
          <span>{absent} Alpa</span>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className={`h-full rounded-full ${isWarning ? "bg-amber-500" : "bg-emerald-500"}`}
            style={{ width: `${percent}%` }}
          ></div>
        </div>
      </div>

      {/* Badge note */}
      {note && (
        <div className="mt-3">
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
            {note}
          </span>
        </div>
      )}

      {/* ⬇️ Tombol Link ke Detail Kelas */}
      <div className="mt-3 flex flex-1 items-end">
        <Link
          to={`/detail-kelas/${kelasId}`}
          className="block w-full rounded-lg border border-gray-200 bg-white py-2 text-center text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Lihat Detail Presensi
        </Link>
      </div>
    </div>
  );
}