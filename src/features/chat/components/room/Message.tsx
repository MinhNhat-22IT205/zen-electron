import React from "react";
import { Message as MessageType } from "@/src/shared/types/message.type";
import { useAuthStore } from "@/src/shared/libs/zustand/auth.zustand";

type MessageProps = {
  message: MessageType;
};
const Message = ({ message }: MessageProps) => {
  const myUserId = useAuthStore((state) => state.endUser?._id);
  const isMe = message.endUserId === myUserId;
  return (
    <div
      className={`flex flex-col p-2 ${isMe ? "items-end " : "items-start "}`}
    >
      <div
        className={`px-2.5 py-1.5 rounded-xl ${isMe ? " bg-blue-500 text-white !rounded-br-none" : " bg-gray-200 !rounded-bl-none"}`}
      >
        {message.content}
      </div>
    </div>
  );
};

export default Message;
