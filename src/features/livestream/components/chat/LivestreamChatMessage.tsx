import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/shared/components/shadcn-ui/avatar";
import { IMAGE_BASE_URL } from "@/src/shared/constants/base-paths";

interface LivestreamChatMessageProps {
  name: string;
  message: string;
  time: string;
  avatar: string;
}

const LivestreamChatMessage = ({
  name,
  message,
  time,
  avatar,
}: LivestreamChatMessageProps) => {
  return (
    <div className="flex items-start space-x-3 mb-4">
      <Avatar>
        <AvatarImage src={IMAGE_BASE_URL + avatar} alt={name} />
        <AvatarFallback>
          {name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-200">{name}</span>
          <span className="text-xs text-gray-400">{time}</span>
        </div>
        <p className="text-sm mt-1 text-gray-300">{message}</p>
      </div>
    </div>
  );
};

export default LivestreamChatMessage;
