// src/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import type { JSX } from "react";
import { useAuth } from "./AuthContext";

type Props = {
  children: JSX.Element;
};

export default function ProtectedRoute({ children }: Props) {
  const { userInfo } = useAuth();

  // Nếu chưa có user -> redirect về login
  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
