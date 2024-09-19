import { Button } from "../../../../shared/components/shadcn-ui/button";
import { Input } from "../../../../shared/components/shadcn-ui/input";
import { ScrollArea } from "../../../../shared/components/shadcn-ui/scroll-area";
import Text from "../../../../shared/components/shadcn-ui/text";
import {
  CameraIcon,
  ImageIcon,
  Link2Icon,
  PaperPlaneIcon,
  VideoIcon,
} from "@radix-ui/react-icons";
import React, { useEffect } from "react";
import MessageList from "./MessageList";
import useSWR from "swr";
import { CONVERSTAION_API_ENDPOINT } from "../../api/chat-endpoints.api";
import { useParams } from "react-router-dom";
import { fetcher } from "@/src/shared/libs/swr/fetcher";
import { Conversation } from "@/src/shared/types/conversation.type";
import { useAuthStore } from "@/src/shared/libs/zustand/auth.zustand";
import { useUnreadConversationStore } from "@/src/shared/libs/zustand/unread-conversation.zustand";

const ChatRoom = () => {
  const { id } = useParams();
  const unreadConversationStore = useUnreadConversationStore((state) => state);
  const myEndUserId = useAuthStore((state) => state.endUser?._id);
  const { data: conversation } = useSWR<Conversation>(
    CONVERSTAION_API_ENDPOINT + "/" + id,
    fetcher,
  );
  const otherEndUser = conversation?.endUserIds.find(
    (endUser) => endUser._id !== myEndUserId,
  );
  useEffect(() => {
    unreadConversationStore.removeUnreadConversationId(id);
  }, [id]);
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center p-2 border-b">
        <Text className="flex-1 font-bold"> {otherEndUser?.username} </Text>
        <div className="flex items-center justify-between">
          <Button variant="ghost">Video</Button>
          <Button variant="ghost">Audio</Button>
        </div>
      </div>
      {/* Chat Messages & Message Input */}
      <MessageList />
    </div>
  );
};

export default ChatRoom;
