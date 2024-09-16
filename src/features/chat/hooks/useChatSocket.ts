import { useEffect, useCallback } from "react";
import { Message } from "@/src/shared/types/message.type";
import { Socket } from "socket.io-client";
import { useAuthStore } from "@/src/shared/libs/zustand/auth.zustand";
import { useUnreadConversationStore } from "@/src/shared/libs/zustand/unread-conversation.zustand";

export default function useChatSocket(
  conversationId: string,
  addMessageToUI: (message: Message) => void,
  clientSocket: Socket
) {
  const unreadConversationStore=useUnreadConversationStore((state)=>state)
  const myEndUserId = useAuthStore((state) => state.endUser?._id);
  useEffect(() => {
    // Only add listeners if a conversation ID exists
    if (!conversationId) return;

    clientSocket.on("connect", () => {
    });
    
    clientSocket.on("connect_error", (err) => {
      console.error("Connection error: ", err);
    });
    
    clientSocket.on("disconnect", () => {
      console.log("Disconnected");
    });
    
    clientSocket.emit("endUserConnect", { endUserId: myEndUserId });
    // Join the conversation
    // clientSocket.emit("joinConversation", { conversationId });

    // Listen for new messages
    const handleSendMessage = (message: Message) => {
      if(message.conversationId==conversationId){
        addMessageToUI(message);
      }else{
        unreadConversationStore.addUnreadConversationId(message.conversationId)
      }
    };
    clientSocket.on("sendMessage", handleSendMessage);

    // Cleanup: Leave the room and remove the listener on unmount or when conversationId changes
    return () => {
      clientSocket.emit("leaveConversation", { conversationId });
      clientSocket.off("sendMessage", handleSendMessage);
    };
  }, [conversationId, clientSocket, addMessageToUI]);

  // Emit message function
  const emitMessage = useCallback(
    (content: string, endUserId: string) => {
      clientSocket.emit("sendMessage", { content, endUserId, conversationId });
    },
    [clientSocket, conversationId]
  );

  return { emitMessage };
}
