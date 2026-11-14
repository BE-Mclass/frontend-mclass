import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listAnnouncements } from "../../services/announcementService";

const fallbackAnnouncements = [
  {
    id: 1,
    tag: "PENTING",
    tagColor: "bg-emerald-600",
    title: "Upacara Peringatan Hari Santri Nasional",
    meta: "Hari ini • 14:30 WIB",
    desc: "Seluruh siswa diharapkan hadir dengan pakaian seragam batik dan membawa buku catatan untuk mengikuti upacara. Presensi akan dimulai pukul 07:00 WIB di lapangan utama madrasah.",
  },
  {
    id: 2,
    tag: "PENTING",
    tagColor: "bg-amber-500",
    title: "Delegasi Kegiatan Lomba Pramuka Gudep 07-08",
    meta: "Hari ini • 14:30 WIB",
    desc: "Sebanyak 16 siswa terpilih akan mengikuti upacara dan penyerahan kontingen oleh Kamad pada 08:00 WIB. Presensi akan dilakukan melalui aplikasi presensi sebelum kegiatan berlangsung.",
  },
  {
    id: 3,
    tag: "INFO",
    tagColor: "bg-blue-500",
    title: "Penyelesaian Jam Presensi Kependidikan Hari Ini",
    meta: "2 hari lalu • 08:00 WIB",
    desc: "Presensi kepulangan siswa akan diproses menggunakan sistem digital. Jam presensi kepulangan akan disesuaikan dengan jadwal harian. Bagi siswa yang berhalangan hadir, harap konfirmasi ke wali kelas masing-masing.",
  },
];

function mapFromBackend(item) {
  const isUrgent = item.priority === "urgent" || item.priority === "important";
  const isHoliday = item.category === "holiday";
  return {
    id: item.id,
    tag: isHoliday
      ? "LIBUR"
      : isUrgent
      ? "PENTING"
      : (item.category || "INFO").toUpperCase(),
    tagColor: isHoliday
      ? "bg-red-500"
      : isUrgent
      ? "bg-emerald-600"
      : "bg-blue-500",
    title: item.title,
    meta: `${String(item.publish_date).slice(0, 10)} • Target: ${(
      item.target_audience || "semua"
    ).toUpperCase()}`,
    desc: item.description,
  };
}

export default function AnnouncementList() {
  const [items, setItems] = useState(fallbackAnnouncements);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    let isMounted = true;
    listAnnouncements({
      category: selectedCategory || undefined,
    })
      .then((data) => {
        if (!isMounted) return;
        if (Array.isArray(data) && data.length > 0) {
          setItems(data.slice(0, 5).map(mapFromBackend));
        } else if (selectedCategory) {
          setItems([]);
        }
      })
      .catch(() => {
        // Keep fallback announcements on offline/unauthenticated preview
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCategory]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900">
            Pengumuman Kelas & Madrasah
          </h3>
          <p className="mt-0.5 text-xs text-gray-500">
            Informasi terbaru seputar kegiatan KBM & dispensasi siswa.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 focus:outline-none"
          >
            <option value="">Semua Kategori</option>
            <option value="important">Penting</option>
            <option value="academic">Akademik</option>
            <option value="activity">Kegiatan</option>
            <option value="holiday">Libur</option>
            <option value="info">Info</option>
          </select>

          <Link
            to="/buat-pengumuman"
            className="flex items-center gap-1 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5v14" />
            </svg>
            Tambah
          </Link>
        </div>
      </div>

      {/* List */}
      <div className="mt-4 divide-y divide-gray-100">
        {items.length === 0 ? (
          <p className="py-4 text-center text-xs text-gray-400">
            Tidak ada pengumuman pada kategori ini.
          </p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex items-center gap-2">
                <span className={`rounded px-2 py-0.5 text-[9px] font-bold text-white ${item.tagColor}`}>
                  {item.tag}
                </span>
                <span className="text-[10px] font-medium text-gray-500">
                  {item.meta}
                </span>
              </div>
              <h4 className="mt-2 text-sm font-bold text-gray-900">
                {item.title}
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">
                {item.desc}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
