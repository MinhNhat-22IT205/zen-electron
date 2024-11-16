import { useEffect } from "react";
import { Message } from "@/src/shared/types/message.type";
import { useAuthStore } from "@/src/shared/libs/zustand/auth.zustand";
import { useUnreadConversationStore } from "@/src/shared/libs/zustand/unread-conversation.zustand";
import { useSocketStore } from "@/src/shared/libs/zustand/socket-instance.zustand";

interface UseChatSocketProps {
  conversationId: string;
  uiControl: {
    addMessageToUI: (message: Message) => void;
    setSeenToUI: (messageId: string) => void;
  };
  isLocal: boolean;
}

export default function useChatSocket({
  conversationId,
  uiControl,
  isLocal,
}: UseChatSocketProps) {
  const unreadConversationStore = useUnreadConversationStore();
  const endUser = useAuthStore((state) => state.endUser);
  const { socket: clientSocket } = useSocketStore();

  useEffect(() => {
    if (!conversationId || !clientSocket) return;

    const handleSendMessage = (message: Message & { isLocal: boolean }) => {
      console.log(message);
      if (message.isLocal && message.endUserId._id !== endUser._id) {
        window.api.saveMessage(endUser._id, {
          _id: Math.random().toString(),
          content: message.content,
          type: "text",
          createdAt: new Date(),
          visibility: "normal",
          read: false,
          conversationId: conversationId,
          endUserId: message.endUserId,
        });
      }
      if (message.conversationId === conversationId) {
        console.log("IM IN HERE BUT UI DON'T DISPLAY");
        uiControl.addMessageToUI(message);
      } else {
        unreadConversationStore.addUnreadConversationId(message.conversationId);
      }
    };

    const handleSeenMessage = ({ _id }: { _id: string }) =>
      uiControl.setSeenToUI(_id);

    clientSocket.on("sendMessage", handleSendMessage);
    clientSocket.on("seenMessage", handleSeenMessage);

    return () => {
      clientSocket.emit("leaveConversation", { conversationId });
      clientSocket.off("sendMessage", handleSendMessage);
      clientSocket.off("seenMessage", handleSeenMessage);
    };
  }, [
    conversationId,
    clientSocket,
    uiControl,
    endUser._id,
    unreadConversationStore,
  ]);

  const emitMessage = (content: string, endUserId: string) => {
    if (isLocal) {
      window.api.saveMessage(endUser._id, {
        _id: Math.random().toString(),
        endUserId: endUser,
        content: content,
        type: "text",
        createdAt: new Date(),
        visibility: "normal",
        read: false,
        conversationId: conversationId,
      });
    }
    clientSocket?.emit("sendMessage", {
      content,
      endUserId,
      conversationId,
      isLocal,
    });
  };

  const seenMessage = (messageId: string) => {
    clientSocket?.emit("seenMessage", {
      messageId,
      conversationId,
      endUserId: endUser._id,
    });
  };

  const emitFileMessage = async (file: File, endUserId: string) => {
    const fileName = file.name;
    clientSocket?.emit("sendFile", {
      file,
      fileName,
      endUserId,
      conversationId,
    });
  };

  return { emitMessage, seenMessage, emitFileMessage };
}
