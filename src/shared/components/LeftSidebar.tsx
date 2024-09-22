import React from "react";
import Heading from "./shadcn-ui/heading";
import Text from "./shadcn-ui/text";
import { Button } from "./shadcn-ui/button";
import { Link, useNavigate } from "react-router-dom";
import {
  BellIcon,
  ChatBubbleIcon,
  Cross2Icon,
  HomeIcon,
} from "@radix-ui/react-icons";
import { useAuthStore } from "../libs/zustand/auth.zustand";
import { IMAGE_BASE_URL } from "../constants/base-paths";
import { Avatar, AvatarFallback, AvatarImage } from "./shadcn-ui/avatar";

const LeftSidebar = () => {
  const authStore = useAuthStore((state) => state);
  const navigate = useNavigate();
  return (
    <div className="h-full w-72 p-4 shadow-xl">
      {/* User Profile */}
      <div
        className="flex flex-col items-center justify-center space-x-3"
        onClick={() => navigate("user-profile/" + authStore.endUser._id)}
      >
        <Avatar className="cursor-pointer">
          <AvatarImage
            src={IMAGE_BASE_URL + authStore.endUser.avatar}
            alt="User Avatar"
            onClick={() => navigate("user-profile/" + authStore.endUser._id)}
          >
            {authStore.endUser.username.charAt(0)}
          </AvatarImage>
          <AvatarFallback>
            {authStore.endUser.username.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <Heading className="text-center">
            {authStore.endUser.username}
          </Heading>
          <Text className="text-gray-500">{authStore.endUser.email}</Text>
        </div>
      </div>

      {/* Stats Section */}
      {/* <div className="mt-6">
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
      </div> */}

      {/* Divider */}
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
          <Link to="/conversations" className="flex items-center gap-2">
            <ChatBubbleIcon className="w-5 h-4.5" />
            <Text>Chats</Text>
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="w-full flex justify-start space-x-3"
          asChild
        >
          <Link to="/notification" className="flex items-center gap-2">
            <BellIcon className="w-5 h-5" />
            <Text>Notificaiton</Text>
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="w-full flex justify-start space-x-3"
          asChild
        >
          <Link
            to="/feeds"
            className="flex items-center gap-2"
            onClick={() => authStore.setEndUser(null)}
          >
            <Cross2Icon className="w-5 h-5" />
            <Text>Logout</Text>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default LeftSidebar;
