import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/shared/components/shadcn-ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/shared/components/shadcn-ui/tabs";
import React from "react";
import { Link, useParams } from "react-router-dom";
import LikedPostList from "../../post/components/post-list/LikedPostList";
import CreatedPostList from "../../post/components/post-list/CreatedPostList";
import useFetchEndUser from "../hooks/useFetchEndUser";
import { Button } from "@/src/shared/components/shadcn-ui/button";
import {
  DotsHorizontalIcon,
  PaperPlaneIcon,
  StarFilledIcon,
} from "@radix-ui/react-icons";
import { useAuthStore } from "@/src/shared/libs/zustand/auth.zustand";
import { useDisclosure } from "@/src/shared/hooks/use-disclosure";
import EditProfileDialog from "./EditProfileDialog";
import { IMAGE_BASE_URL } from "@/src/shared/constants/base-paths";

const UserProfilePage = () => {
  const { open, close, isOpen } = useDisclosure(false);
  const { id } = useParams<{ id: string }>();
  const myEndUserId = useAuthStore((state) => state.endUser?._id);
  const { endUser, isLoading } = useFetchEndUser(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex items-center gap-6">
          <Avatar className="h-24 w-24 ring-4 ring-blue-100 dark:ring-blue-900">
            <AvatarImage
              src={IMAGE_BASE_URL + endUser?.avatar}
              alt={endUser.username}
              className="object-cover"
            />
            <AvatarFallback className="text-2xl bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-100">
              {endUser.username.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {endUser.username}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mb-2">
                  {endUser.email}
                </p>
                <div className="flex items-center text-yellow-500 dark:text-yellow-400">
                  <span className="font-semibold mr-1">
                    {endUser?.star ?? 0}
                  </span>
                  <StarFilledIcon className="w-5 h-5" />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="default"
                  className="bg-blue-500 hover:bg-blue-600 text-white shadow-md"
                  asChild
                >
                  <Link
                    to={
                      "/conversations/create-conversation?userId=" + endUser._id
                    }
                    className="flex items-center gap-2"
                  >
                    Message
                    <PaperPlaneIcon className="h-4 w-4" />
                  </Link>
                </Button>
                {myEndUserId === endUser._id && (
                  <Button
                    variant="outline"
                    onClick={open}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <DotsHorizontalIcon className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>

            {endUser.description && (
              <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {endUser.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="posts" className="text-sm font-medium">
            User Posts
          </TabsTrigger>
          <TabsTrigger value="liked" className="text-sm font-medium">
            Liked Posts
          </TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          <CreatedPostList />
        </TabsContent>
        <TabsContent value="liked">
          <LikedPostList />
        </TabsContent>
      </Tabs>

      <EditProfileDialog
        isOpen={isOpen}
        onChange={(isOpen) => {
          if (!isOpen) {
            close();
          } else {
            open();
          }
        }}
        close={close}
      />
    </div>
  );
};

export default UserProfilePage;
