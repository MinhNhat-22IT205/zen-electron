import Text from "../../../shared/components/shadcn-ui/text";
import Heading from "../../../shared/components/shadcn-ui/heading";
import React from "react";
import { Button } from "../../../shared/components/shadcn-ui/button";
import { PlusCircledIcon, PlusIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";

type RightSidebarProps = {
  livestreamListComponent: React.ReactNode;
  addLivestreamButtonComponent: React.ReactNode;
};

const RightSidebar = ({
  livestreamListComponent,
  addLivestreamButtonComponent,
}: RightSidebarProps) => {
  return (
    <div className="h-full w-72 p-4 shadow-xl bg-white">
      {/* User Requests */}
      {/* <Heading>Join group requests</Heading> */}
      {/* <div className="flex items-center justify-center space-x-3 gap-2">
        <img
          className="w-12 h-12 rounded-full"
          src="https://via.placeholder.com/150"
          alt="User profile"
        />
        <div>
          <Text className="text-gray-500">
            <span className="font-bold text-zinc-800">Katia Zuora</span> want to
            add friend with you.
          </Text>
          <div>
            <Button variant="ghost" className="text-blue-700">
              Accept
            </Button>
            <Button variant="ghost" className="text-gray-700">
              Decline
            </Button>
          </div>
        </div>
      </div> */}
      {/* <div className="h-20" /> */}
      {/* <div className="border-2 border-dashed mt-6 mb-4" /> */}
      <div className="flex items-center justify-between">
        <Heading className="py-4 text-red-600">Livestreams</Heading>
        {addLivestreamButtonComponent}
      </div>
      {livestreamListComponent}
    </div>
  );
};

export default RightSidebar;
