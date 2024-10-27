import React from "react";
import { Outlet } from "react-router-dom";
import RightSidebar from "./RightSidebar";
import LivestreamList from "@/src/features/livestream/components/LivestreamList";

const FeedPageLayout = ({
  livestreamListComponent,
  addLivestreamButtonComponent,
}: {
  livestreamListComponent: React.ReactNode;
  addLivestreamButtonComponent: React.ReactNode;
}) => {
  return (
    <div className="flex h-screen w-full gap-4">
      <div className=" bg-gray-100 overflow-y-auto no-scrollbar py-4 flex-1">
        <Outlet />
      </div>
      <RightSidebar
        livestreamListComponent={livestreamListComponent}
        addLivestreamButtonComponent={addLivestreamButtonComponent}
      />
    </div>
  );
};

export default FeedPageLayout;
