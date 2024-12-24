import { useEffect } from "react";
import { Message } from "@/src/shared/types/message.type";
import { useAuthStore } from "@/src/shared/libs/zustand/auth.zustand";
import { useUnreadConversationStore } from "@/src/shared/libs/zustand/unread-conversation.zustand";
import { useSocketStore } from "@/src/shared/libs/zustand/socket-instance.zustand";
import { IMAGE_BASE_URL } from "@/src/shared/constants/base-paths";
import fileToBase64 from "@/src/shared/helpers/convertBase64";
import e from "express";
import { getEndUser } from "../../authentication/api/auth.api";

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
      if (message.endUserId._id !== endUser._id) {
        const localMessage = isLocal ? " ở secret conversation" : "";
        window.api.showNotification(
          "Tin nhắn của " + message.endUserId.username + localMessage,
          message.content,
          IMAGE_BASE_URL + message.endUserId.avatar,
        );
      }
      console.log("The message is", message);
      if (
        message.isLocal &&
        message.endUserId._id !== endUser._id &&
        message.type === "text"
      ) {
        window.api.saveMessage(endUser._id, {
          _id: Math.random().toString(),
          content: message.content,
          type: message.type,
          createdAt: new Date(),
          visibility: "normal",
          read: false,
          conversationId: conversationId,
          endUserId: message.endUserId,
        });
      } else if (
        message.isLocal &&
        message.endUserId._id !== endUser._id &&
        message.type === "file"
      ) {
        console.log("message content ", message.content);
        window.api.saveFile(
          // @ts-ignore
          message.endUserId,
          endUser._id,
          // @ts-ignore
          message.content,
          message.conversationId,
        );
      }
      console.log(
        "is the same conversationid",
        message.conversationId === conversationId,
      );
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
      isLocal,
    });
  };

  const toBase64: any = (file: File) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const emitFileMessage = async (file: File, endUserId: string) => {
    const fileName = file.name;
    const fileBase64: string = await toBase64(file);
    if (isLocal) {
      // @ts-ignore
      window.api.saveFile(
        endUser,
        endUser._id,
        fileBase64.split(",")[1],
        conversationId,
      );
    }
    clientSocket?.emit("sendFile", {
      file,
      fileName,
      endUserId,
      conversationId,
      isLocal,
    });
  };

  return { emitMessage, seenMessage, emitFileMessage };
}
