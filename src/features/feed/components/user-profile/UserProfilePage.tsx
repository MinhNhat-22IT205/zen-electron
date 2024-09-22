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
import { useParams } from "react-router-dom";
import LikedPostList from "./LikedPostList";
import UserPostList from "./UserPostList";
import useFetchEndUser from "../../hooks/useFetchEndUser";

const UserProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const { endUser, isLoading } = useFetchEndUser(id);
  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="flex flex-col items-center p-4 w-[500px]">
      <div
        className={`flex items-center justify-start gap-2 w-full p-2 rounded-lg`}
      >
        <Avatar>
          <AvatarImage
            src={"localhost:3001/uploads/" + endUser?.avatar}
            alt="@shadcn"
          />
          <AvatarFallback>{endUser.username}</AvatarFallback>
        </Avatar>

        <div className={`flex flex-col items-start justify-center gap-2`}>
          <h3 className="text-xl font-bold">{endUser.username}</h3>
          <p className="text-gray-500 truncate">{endUser.email}</p>
        </div>
      </div>
      <p className="px-4">{endUser.description}</p>
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
    </div>
  );
};

export default UserProfilePage;
