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
import LikedPostList from "./LikedPostList";
import UserPostList from "./UserPostList";
import useFetchEndUser from "../../hooks/useFetchEndUser";
import { Button } from "@/src/shared/components/shadcn-ui/button";
import { DotsHorizontalIcon, PaperPlaneIcon } from "@radix-ui/react-icons";
import { useAuthStore } from "@/src/shared/libs/zustand/auth.zustand";
import { useDisclosure } from "@/src/shared/hooks/use-disclosure";
import EditProfileDialog from "./EditProfileDialog";
import { IMAGE_BASE_URL } from "@/src/shared/constants/base-paths";

const UserProfilePage = () => {
  const { open, close, isOpen } = useDisclosure(false);
  const { id } = useParams<{ id: string }>();
  const myEndUserId = useAuthStore((state) => state.endUser?._id);
  const { endUser, isLoading } = useFetchEndUser(id);
  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="flex flex-col items-center p-4 w-[500px]">
      <div
        className={`flex items-center justify-start gap-3 w-full p-2 rounded-lg`}
      >
        <Avatar>
          <AvatarImage src={IMAGE_BASE_URL + endUser?.avatar} alt="@shadcn" />
          <AvatarFallback>{endUser.username}</AvatarFallback>
        </Avatar>

        <div className={`flex flex-col items-start justify-center gap-2`}>
          <h3 className="text-xl font-bold">{endUser.username}</h3>
          <p className="text-gray-500 truncate">{endUser.email}</p>
        </div>
        <div className="flex-1 flex justify-end">
          <Button variant="secondary">
            <Link
              to={"/conversations/create-conversation?userId=" + endUser._id}
              className="flex gap-1 items-center"
            >
              Message
              <PaperPlaneIcon className="h-4 w-4 ml-2" />
            </Link>
          </Button>
          {myEndUserId === endUser._id && (
            <Button variant="ghost" onClick={open}>
              <DotsHorizontalIcon />
            </Button>
          )}
        </div>
      </div>
      <p className="px-4 text-left mr-auto">{endUser.description}</p>
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="posts">User posts</TabsTrigger>
          <TabsTrigger value="liked">Liked posts</TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          <UserPostList />
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
