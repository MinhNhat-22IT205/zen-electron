import React from "react";
import Heading from "../shared/components/shadcn-ui/heading";
import Text from "../shared/components/shadcn-ui/text";
import { Button } from "../shared/components/shadcn-ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../shared/libs/zustand/auth.zustand";
import { IMAGE_BASE_URL } from "../shared/constants/base-paths";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../shared/components/shadcn-ui/avatar";
import {
  HomeIcon,
  ChatBubbleIcon,
  TimerIcon,
  ExitIcon,
  PersonIcon,
} from "@radix-ui/react-icons";

const LeftSidebar = () => {
  const authStore = useAuthStore((state) => state);
  const navigate = useNavigate();
  return (
    <div className="h-full w-72 p-6 shadow-xl bg-white dark:bg-gray-900">
      {/* User Profile */}
      <div
        className="flex flex-col items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => navigate("user-profile/" + authStore.endUser._id)}
      >
        <Avatar className="h-20 w-20 mb-3">
          <AvatarImage
            src={IMAGE_BASE_URL + authStore.endUser.avatar}
            alt="User Avatar"
          />
          <AvatarFallback className="text-xl">
            {authStore.endUser.username.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="text-center">
          <Heading className="text-xl font-bold mb-1">
            {authStore.endUser.username}
          </Heading>
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            {authStore.endUser.email}
          </Text>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-gray-800 my-6" />

      {/* Navigation Links */}
      <div className="space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start hover:bg-gray-100 dark:hover:bg-gray-800"
          asChild
        >
          <Link to="/feeds" className="flex items-center gap-3">
            <HomeIcon className="w-5 h-5" />
            <Text>Feeds</Text>
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start hover:bg-gray-100 dark:hover:bg-gray-800"
          asChild
        >
          <Link to="/groups" className="flex items-center gap-3">
            <PersonIcon className="w-5 h-5" />
            <Text>Groups</Text>
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start hover:bg-gray-100 dark:hover:bg-gray-800"
          asChild
        >
          <Link to="/conversations" className="flex items-center gap-3">
            <ChatBubbleIcon className="w-5 h-5" />
            <Text>Chats</Text>
          </Link>
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start hover:bg-gray-100 dark:hover:bg-gray-800"
          asChild
        >
          <Link to="/pomodoro" className="flex items-center gap-3">
            <TimerIcon className="w-5 h-5" />
            <Text>Pomodoro</Text>
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start hover:bg-gray-100 dark:hover:bg-gray-800 mt-6"
          asChild
        >
          <Link
            to="/feeds"
            className="flex items-center gap-3 text-red-500 dark:text-red-400"
            onClick={() => authStore.setEndUser(null)}
          >
            <ExitIcon className="w-5 h-5" />
            <Text>Logout</Text>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default LeftSidebar;
