import Text from "../../../shared/components/shadcn-ui/text";
import Heading from "../../../shared/components/shadcn-ui/heading";
import React from "react";
import { Button } from "../../../shared/components/shadcn-ui/button";
import { PlusCircledIcon } from "@radix-ui/react-icons";

const RightSidebar = () => {
  return (
    <div className="h-full w-72 p-4 shadow-xl bg-white">
      {/* User Requests */}
      <Heading>Friend requests</Heading>
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
      <div className="h-40" />
      <div className="border-2 border-dashed mt-6 mb-4" />

      {/* Navigation Links */}
      <Heading>Suggestion for you</Heading>
      {/* <div className="flex items-center justify-center space-x-3 gap-2">
        <img
          className="w-12 h-12 rounded-full"
          src="https://via.placeholder.com/150"
          alt="User profile"
        />
        <div>
          <Text className="text-center font-bold">Katia Zuora</Text>
          <Text className="text-center text-gray-500">
            Tallahassee, Florida
          </Text>
        </div>
        <Button variant="ghost" className="text-gray-500">
          <PlusCircledIcon className="w-5 h-5" />
        </Button>
      </div> */}
    </div>
  );
};

export default RightSidebar;
