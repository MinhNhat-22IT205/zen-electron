import { useNavigate, useParams } from "react-router-dom";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/shared/components/shadcn-ui/avatar";
import { Conversation } from "@/src/shared/types/conversation.type";
import { useAuthStore } from "@/src/shared/libs/zustand/auth.zustand";
import { useUnreadConversationStore } from "@/src/shared/libs/zustand/unread-conversation.zustand";
import { IMAGE_BASE_URL } from "@/src/shared/constants/base-paths";
import { useActiveUserIdStore } from "@/src/shared/libs/zustand/active-user.zustand";
import { getConversationName } from "@/src/shared/helpers/get-conversation-name";

interface ConversationItemProps {
  conversation: Conversation;
}

const ConversationItem = ({ conversation }: ConversationItemProps) => {
  const navigate = useNavigate();
  const { id: currentConversationId } = useParams();
  const unreadConversationIds = useUnreadConversationStore(
    (state) => state.unreadConversationIds,
  );
  const activeUserIds = useActiveUserIdStore((state) => state.activeUserIds);
  const myEndUserId = useAuthStore((state) => state.endUser?._id);

  const otherEndUser = conversation.endUserIds.find(
    (endUser) => endUser._id !== myEndUserId,
  );

  const isCurrentConversation = currentConversationId === conversation._id;
  const isUnread = unreadConversationIds.includes(conversation._id);
  const hasActiveUser =
    activeUserIds.length > 0 &&
    conversation.endUserIds.some(
      (user) => activeUserIds.includes(user._id) && user._id !== myEndUserId,
    );

  const navigateToConversation = () =>
    navigate(`/conversations/${conversation._id}`);
  const navigateToUserProfile = () =>
    navigate(`/user-profile/${otherEndUser?._id}`);

  return (
    <div className="p-2 w-full" onClick={navigateToConversation}>
      <div
        className={`
          hover:bg-gray-100 cursor-pointer flex items-center justify-start 
          gap-2 w-full p-2 rounded-lg ${isCurrentConversation ? "bg-gray-100" : ""}
        `}
      >
        <Avatar className="cursor-pointer" onClick={navigateToUserProfile}>
          <AvatarImage
            src={IMAGE_BASE_URL + otherEndUser?.avatar}
            alt={otherEndUser?.username}
          />
          <AvatarFallback>{otherEndUser?.username.charAt(0)}</AvatarFallback>
        </Avatar>

        <div
          className={`flex flex-1 flex-col items-start justify-center ${isUnread ? "font-bold" : ""}`}
        >
          <p>{getConversationName(conversation.endUserIds, myEndUserId)}</p>
        </div>

        <div
          className={`w-2 h-2 rounded-full ${hasActiveUser ? "bg-green-500" : "bg-gray-500"}`}
        />
      </div>
    </div>
  );
};

export default ConversationItem;
