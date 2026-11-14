export default function Topbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 py-2.5 md:px-6">
      {/* Kiri: Logo M-Class + Badge */}
      <div className="flex items-center gap-3">
        {/* ⬇️ TOMBOL SANDWICH (Hanya muncul di layar < lg) */}
        <button
          onClick={onMenuClick}
          className="rounded-md p-1 text-gray-600 hover:bg-gray-100 lg:hidden"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <img src="/mclass-logo.png" alt="Logo M-Class" className="h-9 w-9 object-contain" />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-gray-900">M-Class</h1>
            <span className="hidden rounded bg-emerald-600 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-white sm:inline-block">
              MTS AL-MA'ARIF
            </span>
          </div>
          <p className="hidden text-[10px] text-gray-500 sm:block">
            Sistem Presensi Digital & Verifikasi Geospasial
          </p>
        </div>
      </div>

      {/* Kanan: Status & Buttons */}
      <div className="flex items-center gap-2">
        {/* Tempatkan tombol-tombol kananmu di sini */}
      </div>
    </header>
  );
}