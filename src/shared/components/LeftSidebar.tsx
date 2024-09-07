import React from "react";
import Heading from "./shadcn-ui/heading";
import Text from "./shadcn-ui/text";
import { Button } from "./shadcn-ui/button";
import { Link } from "react-router-dom";
import {
  BellIcon,
  ChatBubbleIcon,
  Cross2Icon,
  HomeIcon,
} from "@radix-ui/react-icons";

const LeftSidebar = () => {
  return (
    <div className="h-full w-72 p-4 shadow-xl">
      {/* User Profile */}
      <div className="flex flex-col items-center justify-center space-x-3">
        <img
          className="w-12 h-12 rounded-full"
          src="https://via.placeholder.com/150"
          alt="User profile"
        />
        <div>
          <Heading className="text-center">Katia Zuora</Heading>
          <Text className="text-gray-500">Tallahassee, Florida</Text>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mt-6">
        <div className="text-gray-600 text-sm flex justify-between">
          <Text className="flex flex-col items-center ">
            <span className="font-bold">345</span> Posts
          </Text>
          <Text className="flex flex-col items-center">
            <span className="font-bold">147.75K</span> Followers
          </Text>
          <Text className="flex flex-col items-center">
            <span className="font-bold">2.05M</span> Following
          </Text>
        </div>
      </div>
      <div className="border-2 border-dashed mt-6" />

      {/* Navigation Links */}
      <div className="mt-6 space-y-4">
        <Button
          variant="ghost"
          className="w-full flex justify-start space-x-3"
          asChild
        >
          <Link to="/feeds" className="flex items-center gap-2">
            <HomeIcon className="w-5 h-5" />
            <Text>Feeds</Text>
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="w-full flex justify-start space-x-3"
          asChild
        >
          <Link to="/explore" className="flex items-center gap-2">
            <ChatBubbleIcon className="w-5 h-4.5" />
            <Text>Chats</Text>
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="w-full flex justify-start space-x-3"
          asChild
        >
          <Link to="/explore" className="flex items-center gap-2">
            <BellIcon className="w-5 h-5" />
            <Text>Notificaiton</Text>
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="w-full flex justify-start space-x-3"
          asChild
        >
          <Link to="/feeds" className="flex items-center gap-2">
            <Cross2Icon className="w-5 h-5" />
            <Text>Logout</Text>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default LeftSidebar;
