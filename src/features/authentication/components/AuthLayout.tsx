import React from "react";
import LoginForm from "./LoginForm";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
