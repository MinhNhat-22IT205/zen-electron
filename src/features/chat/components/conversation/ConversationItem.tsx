import { useNavigate, useParams } from "react-router-dom";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/shared/components/shadcn-ui/avatar";
import { Conversation } from "@/src/shared/types/conversation.type";
import { useAuthStore } from "@/src/shared/libs/zustand/auth.zustand";
import { EndUser } from "@/src/shared/types/enduser.type";

type ConversationItemProps = {
  conversation: Conversation;
};
const ConversationItem = ({ conversation }: ConversationItemProps) => {
  const navigate = useNavigate();
  const myEndUserId = useAuthStore((state) => state.endUser?._id);
  const otherEndUser = conversation.endUserIds.find(
    (endUser) => endUser._id !== myEndUserId,
  );
  const { id } = useParams();
  return (
    <div
      className="p-2 w-full"
      onClick={() => navigate("/conversations/" + otherEndUser._id)}
    >
      <div
        className={`hover:bg-gray-100 cursor-pointer flex items-center justify-start gap-2 w-full p-2 rounded-lg ${id == otherEndUser._id && "bg-gray-100"}`}
      >
        <Avatar>
          <AvatarImage
            src={"localhost:3001/uploads/" + otherEndUser.avatar}
            alt="@shadcn"
          />
          <AvatarFallback>{otherEndUser.username.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col items-start justify-center ">
          <p>{otherEndUser.username}</p>
          <p className="text-gray-500 truncate">Last Message</p>
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
