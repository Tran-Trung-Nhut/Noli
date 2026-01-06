// src/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import type { JSX } from "react";
import { useAuth } from "./AuthContext";
import LoadingPage from "../components/common/LoadingPage";

type Props = {
  children: JSX.Element;
};

export default function ProtectedRoute({ children }: Props) {
  const { userInfo, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingPage/>;
  }

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
