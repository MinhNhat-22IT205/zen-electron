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
import { SERVER_SOCKET_URL } from "@/src/shared/libs/socketio/client-socket.base";
import { useDisclosure } from "@/src/shared/hooks/use-disclosure";
import CallRequestDialog from "../call/CallRequestDialog";
import useRequestCallDialog from "../../hooks/useRequestCallDialog";

const clientSocket = io(SERVER_SOCKET_URL);

const MessageList = () => {
  const { id } = useParams();
  const myEndUserId = useAuthStore((state) => state.endUser?._id);
  const { data: messages, mutate } = useSWR<MessageType[]>(
    MESSAGE_API_ENDPOINT + `?limit=1000&skip=0&conversationId=${id}`,
    fetcher,
  );
  const addMessageToUI = (message: MessageType) => {
    mutate((prev) => [...prev, message], false);
  };
  const setSeen = (messageId: string) => {
    mutate((prev) => {
      if (!prev) return prev;
      const updatedMessages = prev.map((message) => {
        if (message._id === messageId) {
          return { ...message, read: true };
        }
        return message;
      });
      return updatedMessages;
    }, false);
  };

  const {
    close,
    open,
    isOpen,
    sender,
    setSender,
    callingConversationId,
    setCallingConversationId,
  } = useRequestCallDialog();

  // const { emitMessage, denyCall, seenMessage } = useChatSocket(
  //   id,
  //   addMessageToUI,
  //   clientSocket,
  //   setSender,
  //   open,
  //   setCallingConversationId,
  //   callingConversationId,
  //   setSeen,
  // );
  const { emitMessage, denyCall, seenMessage } = useChatSocket({
    conversationId: id,
    clientSocket,
    uiControl: {
      addMessageToUI,
      setSeenToUI: setSeen,
    },
    callDialogControl: {
      setCaller: setSender,
      openCallRequestDialog: open,
      setCallingConversationId,
      callingConversationId,
    },
  });

  return (
    <>
      <ScrollArea className="flex-1 h-full w-full">
        <div className="">
          {messages?.map((message) => (
            <Message
              key={message._id}
              message={message}
              seenMessage={seenMessage}
            />
          ))}
        </div>
      </ScrollArea>
      {/* Chat Input */}
      <div className="flex px-2 py-2">
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
      {/* File send control panel */}
      {/* <div className="flex items-center py-2 px-4 gap-2">
        <Button variant="ghost" className="!p-1 !h-5">
          <ImageIcon className="w-4 h-4" />
        </Button>
        <Button variant="ghost" className="!p-1 !h-5">
          <Link2Icon className="w-4 h-4" />
        </Button>
      </div> */}
      <CallRequestDialog
        isOpen={isOpen}
        onChange={(isOpen) => {
          if (!isOpen) {
            denyCall();
            close();
          } else {
            open();
          }
          close();
        }}
        sender={sender}
        callingConversationId={callingConversationId}
        denyCall={() => {
          denyCall();
          close();
        }}
      />
    </>
  );
};

export default MessageList;
