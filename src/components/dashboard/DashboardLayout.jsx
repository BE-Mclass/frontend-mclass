import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({ children, footer }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
      <div className="flex flex-1">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          {children}
        </div>
      </div>
      {footer ?? (
        <footer className="flex shrink-0 items-center justify-center border-t border-gray-200 px-6 py-4 text-[10px] text-gray-400">
          <span>
            © 2026 MTs Al-Ma'arif O2 Singosari • Sistem Presensi Digital Terpadu
          </span>
        </footer>
      )}
    </div>
  );
}
