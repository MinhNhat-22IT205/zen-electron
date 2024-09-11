import { useNavigate } from "react-router-dom";
import { Button } from "../../../../shared/components/shadcn-ui/button";
import Text from "../../../../shared/components/shadcn-ui/text";
import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/shared/components/shadcn-ui/avatar";

const ConversationItem = () => {
  const navigate = useNavigate();
  return (
    <div className="p-2 w-full" onClick={() => navigate("/chats/123")}>
      <div className="hover:bg-gray-100 cursor-pointer flex items-center justify-start gap-2 w-full p-2 rounded-lg">
        <Avatar>
          <AvatarImage
            src="https://plus.unsplash.com/premium_photo-1664392248318-4e1d9361726e?q=80&w=1966&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="@shadcn"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <div className="flex flex-col items-start justify-center ">
          <p>Username</p>
          <p className="text-gray-500 truncate">Last Message</p>
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
