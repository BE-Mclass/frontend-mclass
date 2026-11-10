import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import RegistrationForm from "./components/RegistrationForm";
import LoginForm from "./components/LoginForm";
import ForgotPasswordForm from "./components/ForgotPasswordForm";
import Dashboard from "./components/Dashboard";
import SemuaKelas from "./components/SemuaKelas";
import RekapKelas from "./components/RekapKelas";
import KalenderAgenda from "./components/KalenderAgenda";
import Pengaturan from "./components/Pengaturan";
import DetailKelas from "./components/DetailKelas";
import DetailLokasi from "./components/DetailLokasi";
import ValidasiWajah from "./components/ValidasiWajah";
import BuatPengumuman from "./components/BuatPengumuman";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function AuthLayout({ children }) {
  return (
    // ⬇️ Tambahkan relative & overflow-hidden untuk animasi background
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gray-50">

      {/* Ornamen Background Beranimasi */}
      <div className="pointer-events-none absolute left-[-10%] top-[-10%] h-[500px] w-[500px] animate-pulse-bg rounded-full bg-emerald-100/40 blur-3xl"></div>
      <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] h-[400px] w-[400px] animate-pulse-bg rounded-full bg-teal-100/40 blur-3xl" style={{ animationDelay: '2s' }}></div>

      <Header />

      {/* main butuh relative & z-10 agar berada di atas ornamen background */}
      <main className="relative z-10 flex flex-1 items-center justify-center p-4 md:p-6">
        {children}
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Auth Routes */}
          <Route path="/" element={<AuthLayout><LoginForm /></AuthLayout>} />
          <Route path="/login" element={<AuthLayout><LoginForm /></AuthLayout>} />
          <Route path="/register" element={<AuthLayout><RegistrationForm /></AuthLayout>} />
          <Route path="/forgot-password" element={<AuthLayout><ForgotPasswordForm /></AuthLayout>} />

          {/* Dashboard & Main Routes */}
          <Route element={<ProtectedRoute roles={["admin", "guru"]} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/rekap-kelas" element={<RekapKelas />} />
            <Route path="/detail-kelas/:kelas" element={<DetailKelas />} />
            <Route path="/detail-lokasi" element={<DetailLokasi />} />
            <Route path="/semua-kelas" element={<SemuaKelas />} />
            <Route path="/kalender" element={<KalenderAgenda />} />
            <Route path="/pengaturan" element={<Pengaturan />} />
            <Route path="/validasi-wajah/:nis" element={<ValidasiWajah />} />
            <Route path="/buat-pengumuman" element={<BuatPengumuman />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}