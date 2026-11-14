export default function Header() {
  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <img src="/mclass-logo.png" alt="Logo M-Class" className="h-10 w-10 object-contain" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-gray-900">M-Class</h1>
              <span className="rounded bg-emerald-600 px-2 py-0.5 text-[10px] font-bold tracking-wider text-white">
                MTS AL-MA'ARIF
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Sistem Presensi Digital & Verifikasi Geospasial
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

        