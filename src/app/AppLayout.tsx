import React from "react";
import { Link, Outlet } from "react-router-dom";
import LeftSidebar from "../shared/components/LeftSidebar";

const AppLayout = () => {
  return (
    <div className="flex h-screen">
      <LeftSidebar />
      <div className=" bg-gray-100 pl-4 overflow-y-auto no-scrollbar w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
