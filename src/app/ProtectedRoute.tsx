import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../shared/libs/zustand/auth.zustand";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isLoggedIn = useAuthStore((state) => !!state.endUser?._id);

  if (!isLoggedIn) {
    return <Navigate to="/auth" />;
  }

  return children;
};

export default ProtectedRoute;
