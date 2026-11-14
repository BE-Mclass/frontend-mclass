import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getCalendarSummary } from "../../services/announcementService";

const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const SHORT_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];
const FULL_MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function buildMonthGrid(year, monthIndex0) {
  const firstDay = new Date(year, monthIndex0, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, monthIndex0 + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function CalendarWidget() {
  const [year, setYear] = useState(2026);
  const [monthIdx, setMonthIdx] = useState(9); // Okt 2026
  const [summary, setSummary] = useState(null);

  const monthQuery = `${year}-${String(monthIdx + 1).padStart(2, "0")}`;

  useEffect(() => {
    let isMounted = true;
    getCalendarSummary(monthQuery)
      .then((data) => {
        if (isMounted && data) setSummary(data);
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [monthQuery]);

  const calendarData = useMemo(
    () => buildMonthGrid(year, monthIdx),
    [year, monthIdx]
  );

  const dayMarkerMap = useMemo(() => {
    const map = {};
    if (Array.isArray(summary?.days)) {
      summary.days.forEach((d) => {
        if (d.has_event && d.color) {
          map[d.day] = d.color;
        }
      });
    }
    return map;
  }, [summary]);

  const today = 23;

  const handlePrev = () => {
    if (monthIdx === 0) {
      setYear((y) => y - 1);
      setMonthIdx(11);
    } else {
      setMonthIdx((m) => m - 1);
    }
  };

  const handleNext = () => {
    if (monthIdx === 11) {
      setYear((y) => y + 1);
      setMonthIdx(0);
    } else {
      setMonthIdx((m) => m + 1);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-gray-900">Kalender Presensi</h3>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrev}
            className="rounded p-1 text-gray-400 hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <span className="text-xs font-semibold text-gray-700">
            {SHORT_MONTHS[monthIdx]} {year}
          </span>
          <button
            type="button"
            onClick={handleNext}
            className="rounded p-1 text-gray-400 hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      <p className="mt-0.5 text-[10px] text-gray-500">
        {FULL_MONTHS[monthIdx]} {year} • Semester Ganjil
      </p>

      {/* Day Headers */}
      <div className="mt-3 grid grid-cols-7 gap-1 text-center">
        {days.map((d) => (
          <div key={d} className="py-1 text-[10px] font-bold text-gray-400">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="mt-1 grid grid-cols-7 gap-1">
        {calendarData.map((day, i) => {
          if (day === null) return <div key={i} className="aspect-square"></div>;

          const isToday = day === today && year === 2026 && monthIdx === 9;
          const marker = dayMarkerMap[day];
          const isWeekend = i % 7 >= 5;

          return (
            <button
              key={i}
              type="button"
              className={`relative flex aspect-square items-center justify-center rounded-md text-xs font-medium transition ${
                isToday
                  ? "bg-emerald-600 text-white font-bold"
                  : marker === "red"
                  ? "bg-red-50 text-red-600 font-bold"
                  : marker === "amber"
                  ? "bg-amber-50 text-amber-700 font-bold"
                  : isWeekend
                  ? "text-gray-300"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 space-y-2 border-t border-gray-100 pt-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="h-2.5 w-2.5 rounded-sm bg-emerald-600"></span>
          <span className="font-bold text-gray-800">Hari Ini (06.30 - 14.30 WIB)</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span className="h-2.5 w-2.5 rounded-sm bg-amber-400"></span>
          <span>Agenda Penting: Upacara Hari Santri</span>
          <span className="ml-auto text-[10px] font-semibold text-amber-600">
            23 Okt 2026
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span className="h-2.5 w-2.5 rounded-sm bg-emerald-300"></span>
          <span>Libur/Agenda Khusus: Hari Sumpah Pemuda</span>
          <span className="ml-auto text-[10px] text-gray-400">28 Okt 2026</span>
        </div>
      </div>

      <Link
        to="/kalender"
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-2.5 text-xs font-bold text-gray-700 transition hover:bg-gray-50"
      >
        Lihat Jadwal Penuh
      </Link>
    </div>
  );
}
