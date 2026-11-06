import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { clearAuthStorage, getAuthToken } from "../lib/api";
import { fetchCurrentUser } from "../services/authService";

export default function ProtectedRoute({ roles }) {
  const token = getAuthToken();
  const [checking, setChecking] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    let active = true;

    if (!token) {
      setIsValid(false);
      setChecking(false);
      return () => {
        active = false;
      };
    }

    setChecking(true);
    fetchCurrentUser()
      .then((user) => {
        const validRole = user && (roles ? roles.includes(user.role) : ["admin", "guru"].includes(user.role));
        if (active) setIsValid(Boolean(validRole));
        if (!validRole) clearAuthStorage();
      })
      .catch(() => {
        clearAuthStorage();
        if (active) setIsValid(false);
      })
      .finally(() => {
        if (active) setChecking(false);
      });

    return () => {
      active = false;
    };
  }, [token, roles]);

  if (checking) return <div>Memeriksa sesi...</div>;
  return isValid ? <Outlet /> : <Navigate to="/login" replace />;
}