import React, { useEffect } from "react";
import ConversationItem from "./ConversationItem";
import { ScrollArea } from "../../../../shared/components/shadcn-ui/scroll-area";
import useSWR from "swr";
import { Conversation } from "@/src/shared/types/conversation.type";
import { CONVERSTAION_API_ENDPOINT } from "../../api/chat-endpoints.api";
import { fetcher } from "@/src/shared/libs/swr/fetcher";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/src/shared/components/shadcn-ui/button";
import { TriangleLeftIcon } from "@radix-ui/react-icons";
import SearchPage from "@/src/features/search/components/SearchPage";
import { useAuthStore } from "@/src/shared/libs/zustand/auth.zustand";
import http from "@/src/shared/libs/axios/axios.base";

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
    // { refreshInterval: 1000 },
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
    return <div>Loading...</div>;
  }
  if (error) {
    console.log(error);
    return <div>{error.message}</div>;
  }

  return (
    <ScrollArea className="h-full w-full bg-blue-600/50">
      <div className="border-b border-gray-200 ">
        <div className="m-3">
          <SearchPage />
        </div>
        {/* <Button variant="link" onClick={() => navigate("/feeds")}>
          <TriangleLeftIcon className="w-4 h-4" /> Back
        </Button> */}
      </div>
      {conversations?.map((conversation: Conversation) => (
        <ConversationItem key={conversation._id} conversation={conversation} />
      ))}
      <div className="flex flex-col  gap-2 justify-center items-center">
        <Button onClick={() => navigate(`/user-profile/${myEndUserId}`)}>
          User Setting
        </Button>
      </div>
    </ScrollArea>
  );
};

export default ConversationList;
