import { useSocketStore } from "@/src/shared/libs/zustand/socket-instance.zustand";
import { LivestreamMessage } from "@/src/shared/types/message.type";
import React, { useEffect } from "react";

type ChatUIController = {
  addMessage: (message: LivestreamMessage) => void;
};
type UseLivestreamChatSocket = {
  chatUIController: ChatUIController;
};
const useLivestreamChatSocket = ({
  chatUIController,
}: UseLivestreamChatSocket) => {
  const socket = useSocketStore((state) => state.socket);
  useEffect(() => {
    if (!socket) return;
    socket.on("sendMessage", handleSendMessage);
  }, [socket]);

  const handleSendMessage = (message: LivestreamMessage) => {
    console.log("message received:", message);
    chatUIController.addMessage(message);
  };
  const sendMessage = (message: LivestreamMessage) => {
    if (!socket) return;
    socket.emit("sendMessage", message);
  };

  return { sendMessage };
};

export default useLivestreamChatSocket;
