import React from "react";
import { Message as MessageType } from "@/src/shared/types/message.type";
import { useAuthStore } from "@/src/shared/libs/zustand/auth.zustand";
import { useDisclosure } from "@/src/shared/hooks/use-disclosure";

type MessageProps = {
  message: MessageType;
};
const Message = ({ message }: MessageProps) => {
  const { isOpen, toggle } = useDisclosure(false);
  const myUserId = useAuthStore((state) => state.endUser?._id);
  const isMe = message.endUserId === myUserId;
  return (
    <div
      className={`flex flex-col p-2 ${isMe ? "items-end " : "items-start "}`}
    >
      {isOpen && (
        <div className="flex justify-end">
          {new Date(message.createdAt).toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            weekday: "long",
          })}
        </div>
      )}
      <div
        onClick={toggle}
        className={`px-2.5 py-1.5 rounded-xl ${isMe ? " bg-blue-500 text-white !rounded-br-none" : " bg-gray-200 !rounded-bl-none"}`}
      >
        {message.content}
      </div>
      {isOpen && (
        <div className="flex justify-end">
          {message.read ? "Received" : "Sent"}
        </div>
      )}
    </div>
  );
};

export default Message;
