import React, { useEffect, useRef, useState } from "react";
import { Message as MessageType } from "@/src/shared/types/message.type";
import { useAuthStore } from "@/src/shared/libs/zustand/auth.zustand";
import { useDisclosure } from "@/src/shared/hooks/use-disclosure";

type MessageProps = {
  message: MessageType;
  seenMessage: (messageId: string) => void;
};
const Message = ({ message, seenMessage }: MessageProps) => {
  const { isOpen, toggle } = useDisclosure(false);
  const myUserId = useAuthStore((state) => state.endUser?._id);
  const isMe = message.endUserId === myUserId;

  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = messageRef.current;
    if (!element) return; // Ensure element exists

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !message.read && !isMe) {
          seenMessage(message._id); // Call the function when visible
        }
      },
      {
        threshold: 0.1, // 10% visibility required
        rootMargin: "0px 0px -20px 0px", // Start observing slightly before full visibility
      },
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element); // Cleanup observer when component unmounts or element changes
      }
    };
  }, [message._id, seenMessage]);

  return (
    <div
      ref={messageRef}
      className={`flex flex-col p-2 ${isMe ? "items-end " : "items-start "}`}
    >
      {isOpen && (
        <div className="flex justify-end text-sm text-gray-500">
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
      {isOpen && isMe && (
        <div className="flex justify-end text-sm text-gray-500">
          {message.read ? "Received" : "Sent"}
        </div>
      )}
    </div>
  );
};

export default Message;
