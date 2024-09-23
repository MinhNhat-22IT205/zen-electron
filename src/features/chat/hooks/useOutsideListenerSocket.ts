import { useActiveUserIdStore } from "@/src/shared/libs/zustand/active-user.zustand";
import { useAuthStore } from "@/src/shared/libs/zustand/auth.zustand";
import { useUnreadConversationStore } from "@/src/shared/libs/zustand/unread-conversation.zustand";
import { Message } from "@/src/shared/types/message.type";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Socket } from "socket.io-client";

const useOutsideListenerSocket = (clientSocket: Socket) => {
  const myEndUserId = useAuthStore((state) => state.endUser?._id);
  const { id: conversationId } = useParams();
  const unreadConversationStore = useUnreadConversationStore((state) => state);
  const activeUserIdStore = useActiveUserIdStore((state) => state);
  useEffect(() => {
    // Only add listeners if a conversation ID exists
    clientSocket.on("connect", () => {
      console.log("Connected outside");
    });

    clientSocket.on("connect_error", (err) => {
      console.error("Connection error: ", err);
    });

    clientSocket.on("disconnect", () => {
      console.log("Disconnected");
    });

    clientSocket.emit("endUserConnect", { endUserId: myEndUserId });

    setInterval(() => {
      clientSocket.emit("activeList", {});
    }, 5000);

    clientSocket.on(
      "activeList",
      ({ activeList }: { activeList: string[] }) => {
        activeUserIdStore.setActiveUserIds(activeList);
      },
    );

    // Listen for new messages
    const handleUnreadMessage = (message: Message) => {
      if (message.conversationId !== conversationId) {
        unreadConversationStore.addUnreadConversationId(message.conversationId);
      }
    };
    clientSocket.on("sendMessage", handleUnreadMessage);

    return () => {};
  }, [clientSocket]);
  return {};
};

export default useOutsideListenerSocket;
