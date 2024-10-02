import { useEffect } from "react";
import { Message } from "@/src/shared/types/message.type";
import { Socket } from "socket.io-client";
import { useAuthStore } from "@/src/shared/libs/zustand/auth.zustand";
import { useUnreadConversationStore } from "@/src/shared/libs/zustand/unread-conversation.zustand";
import { EndUser } from "@/src/shared/types/enduser.type";

interface UseChatSocketProps {
  conversationId: string;
  clientSocket: Socket;
  uiControl: {
    addMessageToUI: (message: Message) => void;
    setSeenToUI: (messageId: string) => void;
  };
  callDialogControl: {
    setCaller: (caller: EndUser) => void;
    openCallRequestDialog: () => void;
    setCallingConversationId: (conversationId: string) => void;
    callingConversationId: string;
  };
}

export default function useChatSocket({
  conversationId,
  clientSocket,
  uiControl,
  callDialogControl,
}: UseChatSocketProps) {
  const unreadConversationStore = useUnreadConversationStore();
  const myEndUserId = useAuthStore((state) => state.endUser?._id);

  useEffect(() => {
    if (!conversationId) return;

    const handleSendMessage = (message: Message) => {
      const isMessageFromCurrentConversation =
        message.conversationId === conversationId;
      if (isMessageFromCurrentConversation) {
        uiControl.addMessageToUI(message);
      } else {
        unreadConversationStore.addUnreadConversationId(message.conversationId);
      }
    };

    const handleConnect = () => {};
    const handleConnectError = (err: Error) =>
      console.error("Connection error:", err);
    const handleDisconnect = () => console.log("Disconnected");
    const handleSeenMessage = ({ _id }: { _id: string }) =>
      uiControl.setSeenToUI(_id);
    const handleRequestCall = ({
      conversationId,
      sender,
    }: {
      conversationId: string;
      sender: EndUser;
    }) => {
      console.log("requestCall", conversationId, sender);
      callDialogControl.setCaller(sender);
      callDialogControl.setCallingConversationId(conversationId);
      callDialogControl.openCallRequestDialog();
    };

    clientSocket.on("connect", handleConnect);
    clientSocket.on("connect_error", handleConnectError);
    clientSocket.on("disconnect", handleDisconnect);
    clientSocket.on("sendMessage", handleSendMessage);
    clientSocket.on("seenMessage", handleSeenMessage);
    clientSocket.on("requestCall", handleRequestCall);

    clientSocket.emit("endUserConnect", { endUserId: myEndUserId });

    return () => {
      clientSocket.emit("leaveConversation", { conversationId });
      clientSocket.off("sendMessage", handleSendMessage);
    };
  }, [
    conversationId,
    clientSocket,
    uiControl.addMessageToUI,
    myEndUserId,
    unreadConversationStore,
    callDialogControl.setCaller,
    callDialogControl.setCallingConversationId,
    callDialogControl.openCallRequestDialog,
    uiControl.setSeenToUI,
  ]);

  const emitMessage = (content: string, endUserId: string) => {
    clientSocket.emit("sendMessage", { content, endUserId, conversationId });
  };

  const denyCall = () => {
    clientSocket.emit("requestDeny", {
      conversationId: callDialogControl.callingConversationId,
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
