import React from "react";
import { Outlet } from "react-router-dom";
import RightSidebar from "./RightSidebar";

const FeedPageLayout = () => {
  return (
    <div className="flex h-screen w-full gap-4">
      <div className=" bg-gray-100 overflow-y-auto no-scrollbar py-4">
        <Outlet />
      </div>
      <RightSidebar />
    </div>
  );
};

export default FeedPageLayout;
