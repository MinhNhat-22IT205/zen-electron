import React, { useEffect } from "react";
import ConversationItem from "./ConversationItem";
import { ScrollArea } from "../../../../shared/components/shadcn-ui/scroll-area";
import useSWR from "swr";
import { Conversation } from "@/src/shared/types/conversation.type";
import { CONVERSTAION_API_ENDPOINT } from "../../api/chat-endpoints.api";
import { fetcher } from "@/src/shared/libs/swr/fetcher";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/src/shared/components/shadcn-ui/button";
import { TriangleLeftIcon, GearIcon } from "@radix-ui/react-icons";
import SearchPage from "@/src/features/search/components/SearchPage";
import { useAuthStore } from "@/src/shared/libs/zustand/auth.zustand";
import http from "@/src/shared/libs/axios/axios.base";
import Text from "@/src/shared/components/shadcn-ui/text";

const ConversationList = () => {
  const navigate = useNavigate();
  const myEndUserId = useAuthStore((state) => state.endUser?._id);
  const { id } = useParams();
  const {
    data: conversations,
    isLoading,
    error,
    mutate,
  } = useSWR<Conversation[]>(
    CONVERSTAION_API_ENDPOINT + "?limit=1000&skip=0",
    fetcher,
  );

  useEffect(() => {
    const hasLoadedConversations = !isLoading;
    const hasEnterAConversation = !!id;
    if (
      hasLoadedConversations &&
      !hasEnterAConversation &&
      conversations?.length > 0
    ) {
      navigate("/conversations/" + conversations[0]._id);
    }
  }, [isLoading, id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Text className="text-amber-600">Loading conversations...</Text>
      </div>
    );
  }

  if (error) {
    console.log(error);
    return (
      <div className="flex items-center justify-center h-full">
        <Text className="text-red-600">{error.message}</Text>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-amber-50 to-white">
      <div className="p-4 border-b border-amber-200 bg-white/80 backdrop-blur-sm shadow-sm">
        <Text className="font-bold text-xl text-amber-800 mb-4">Messages</Text>
        <SearchPage />
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-1">
          {conversations?.map((conversation: Conversation) => (
            <ConversationItem
              key={conversation._id}
              conversation={conversation}
            />
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-amber-200 bg-white/80 backdrop-blur-sm">
        <Button
          onClick={() => navigate(`/user-profile/${myEndUserId}`)}
          variant="ghost"
          className="w-full hover:bg-amber-100 text-amber-700"
        >
          <GearIcon className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  );
};

export default ConversationList;
