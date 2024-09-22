import React, { useEffect } from "react";
import ConversationItem from "./ConversationItem";
import { ScrollArea } from "../../../../shared/components/shadcn-ui/scroll-area";
import useSWR from "swr";
import { Conversation } from "@/src/shared/types/conversation.type";
import { CONVERSTAION_API_ENDPOINT } from "../../api/chat-endpoints.api";
import { fetcher } from "@/src/shared/libs/swr/fetcher";
import { useParams } from "react-router-dom";

const ConversationList = () => {
  const { id } = useParams();
  const {
    data: conversations,
    isLoading,
    error,
    mutate,
  } = useSWR<Conversation[]>(
    CONVERSTAION_API_ENDPOINT + "?limit=1000&skip=0",
    fetcher,
    { refreshInterval: 1000 },
  );
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    console.log(error);
    return <div>{error.message}</div>;
  }
  return (
    <ScrollArea className="h-full w-full">
      {conversations?.map((conversation: Conversation) => (
        <ConversationItem key={conversation._id} conversation={conversation} />
      ))}
    </ScrollArea>
  );
};

export default ConversationList;
