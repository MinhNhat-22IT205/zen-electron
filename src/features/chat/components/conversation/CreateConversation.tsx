import React, { useEffect } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { addConversation } from "../../api/conversation.api";
import { useAuthStore } from "@/src/shared/libs/zustand/auth.zustand";

import { Conversation } from "@/src/shared/types/conversation.type";

const CreateConversation = () => {
  const [searchParams] = useSearchParams();
  const endUserId = searchParams.get("userId");
  const authStore = useAuthStore((state) => state);
  const [conversationId, setConversationId] = React.useState<string | null>(
    null,
  );
  useEffect(() => {
    (async () => {
      const conversation = await addConversation([
        authStore.endUser._id,
        endUserId,
      ]);
      if (conversation) setConversationId(conversation?._id);
    })();
  }, []);
  if (!conversationId) return null;
  return <Navigate to={"/conversations/" + conversationId} />;
};

export default CreateConversation;
