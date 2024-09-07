import React from "react";
import { Link, Outlet } from "react-router-dom";
import LeftSidebar from "../shared/components/LeftSidebar";

const AppLayout = () => {
  return (
    <div className="flex h-screen">
      <LeftSidebar />
      <div className="w-3/5 bg-gray-100 p-4 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
