import React from "react";

type MessageProps = {
  endUserId: string;
};
const Message = ({ endUserId }: MessageProps) => {
  const myUserId = "1";
  const isMe = endUserId === myUserId;
  return (
    <div
      className={`flex flex-col p-2 ${isMe ? "items-end " : "items-start "}`}
    >
      <div
        className={`px-2.5 py-1.5 rounded-xl ${isMe ? " bg-blue-500 text-white !rounded-br-none" : " bg-gray-200 !rounded-bl-none"}`}
      >
        Message
      </div>
    </div>
  );
};

export default Message;
