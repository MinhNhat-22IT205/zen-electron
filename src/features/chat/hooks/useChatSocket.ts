import { useEffect, useCallback, useState } from "react";
import { Message } from "@/src/shared/types/message.type";
import { Socket } from "socket.io-client";
import { useAuthStore } from "@/src/shared/libs/zustand/auth.zustand";
import { useUnreadConversationStore } from "@/src/shared/libs/zustand/unread-conversation.zustand";
import { EndUser } from "@/src/shared/types/enduser.type";
import { useActiveUserIdStore } from "@/src/shared/libs/zustand/active-user.zustand";

export default function useChatSocket(
  conversationId: string,
  addMessageToUI: (message: Message) => void,
  clientSocket: Socket,
  setCaller: (caller: EndUser) => void,
  openCallRequestDialog: () => void,
  setCallingConversationId: (conversationId: string) => void,
  callingConversationId: string,
  setSeen: (messageId: string) => void,
) {
  const unreadConversationStore = useUnreadConversationStore((state) => state);
  const myEndUserId = useAuthStore((state) => state.endUser?._id);
  useEffect(() => {
    // Only add listeners if a conversation ID exists
    if (!conversationId) return;

    clientSocket.on("connect", () => {});

    clientSocket.on("connect_error", (err) => {
      console.error("Connection error: ", err);
    });

    clientSocket.on("disconnect", () => {
      console.log("Disconnected");
    });

    clientSocket.emit("endUserConnect", { endUserId: myEndUserId });

    // Listen for new messages
    const handleSendMessage = (message: Message) => {
      if (message.conversationId == conversationId) {
        addMessageToUI(message);
      } else {
        unreadConversationStore.addUnreadConversationId(message.conversationId);
      }
    };

    clientSocket.on("sendMessage", handleSendMessage);

    clientSocket.on("seenMessage", ({ _id }: { _id: string }) => {
      setSeen(_id);
    });

    clientSocket.on("requestCall", ({ conversationId, sender }) => {
      if (typeof conversationId !== "string") {
        console.error("Invalid conversationId");
      }
      console.log("requestCall", conversationId, sender);
      setCaller(sender);
      setCallingConversationId(conversationId);
      openCallRequestDialog();
    });

    // Cleanup: Leave the room and remove the listener on unmount or when conversationId changes
    return () => {
      clientSocket.emit("leaveConversation", { conversationId });
      clientSocket.off("sendMessage", handleSendMessage);
    };
  }, [conversationId, clientSocket, addMessageToUI]);

  // Emit message function
  const emitMessage = (content: string, endUserId: string) => {
    clientSocket.emit("sendMessage", { content, endUserId, conversationId });
  };

  const denyCall = () => {
    clientSocket.emit("requestDeny", {
      conversationId: callingConversationId,
      fromEndUserId: myEndUserId,
    });
  };
  const seenMessage = (messageId: string) => {
    clientSocket.emit("seenMessage", {
      messageId,
      conversationId,
      endUserId: myEndUserId,
    });
  };

  return { emitMessage, denyCall, seenMessage };
}
