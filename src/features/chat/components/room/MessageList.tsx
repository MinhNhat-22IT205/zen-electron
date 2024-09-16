import React, { useMemo } from "react";
import Message from "./Message";
import { io } from "socket.io-client";
import useSWR from "swr";
import { MESSAGE_API_ENDPOINT } from "../../api/chat-endpoints.api";
import { useParams } from "react-router-dom";
import { fetcher } from "@/src/shared/libs/swr/fetcher";
import { Message as MessageType } from "@/src/shared/types/message.type";
import useChatSocket from "../../hooks/useChatSocket";
import { ScrollArea } from "@/src/shared/components/shadcn-ui/scroll-area";
import { Button } from "@/src/shared/components/shadcn-ui/button";
import { ImageIcon, Link2Icon, PaperPlaneIcon } from "@radix-ui/react-icons";
import { Input } from "@/src/shared/components/shadcn-ui/input";
import { useAuthStore } from "@/src/shared/libs/zustand/auth.zustand";

const clientSocket = io("http://localhost:3001");

const MessageList = () => {
  const { id } = useParams();
  const myEndUserId = useAuthStore((state) => state.endUser?._id);
  const { data: messages, mutate } = useSWR<MessageType[]>(
    MESSAGE_API_ENDPOINT + `?limit=1000&skip=0&conversationId=${id}`,
    fetcher,
  );
  const addMessageToUI = (message: MessageType) => {
    console.log("igotcalled");
    mutate((prev) => [...prev, message], false);
  };
  const { emitMessage } = useChatSocket(id, addMessageToUI, clientSocket);

  return (
    <>
      <ScrollArea className="flex-1 h-full w-full">
        <div className="">
          {messages?.map((message) => (
            <Message key={message._id} message={message} />
          ))}
        </div>
      </ScrollArea>
      {/* Chat Input */}
      <div className="flex px-2">
        <Input
          className="focus:!outline-none focus-visible:!ring-0 flex-1"
          type="text"
          placeholder="Type a message"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              emitMessage(e.currentTarget.value, myEndUserId);
              e.currentTarget.value = "";
            }
          }}
        />
        <Button variant="ghost">
          <PaperPlaneIcon className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex items-center py-2 px-4 gap-2">
        <Button variant="ghost" className="!p-1 !h-5">
          <ImageIcon className="w-4 h-4" />
        </Button>
        <Button variant="ghost" className="!p-1 !h-5">
          <Link2Icon className="w-4 h-4" />
        </Button>
      </div>
    </>
  );
};

export default MessageList;
