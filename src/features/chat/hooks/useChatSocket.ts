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
}

export default function useChatSocket({
  conversationId,
  uiControl,
}: UseChatSocketProps) {
  const unreadConversationStore = useUnreadConversationStore();
  const myEndUserId = useAuthStore((state) => state.endUser?._id);
  const { socket: clientSocket } = useSocketStore();

  useEffect(() => {
    if (!conversationId || !clientSocket) return;

    const handleSendMessage = (message: Message) => {
      if (message.conversationId === conversationId) {
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
    myEndUserId,
    unreadConversationStore,
  ]);

  const emitMessage = (content: string, endUserId: string) => {
    clientSocket?.emit("sendMessage", { content, endUserId, conversationId });
  };

  const seenMessage = (messageId: string) => {
    clientSocket?.emit("seenMessage", {
      messageId,
      conversationId,
      endUserId: myEndUserId,
    });
  };

  return { emitMessage, seenMessage };
}
