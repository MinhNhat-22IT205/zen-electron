import React from "react";
import LoginForm from "./LoginForm";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-cover bg-center bg-[url('https://plus.unsplash.com/premium_photo-1730857515551-15801c1ca01f?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')]">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
