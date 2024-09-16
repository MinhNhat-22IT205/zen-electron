import React, { useEffect } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { addConversation } from "../../api/conversation.api";
import { useAuthStore } from "@/src/shared/libs/zustand/auth.zustand";

const CreateConversation = () => {
  const [searchParams] = useSearchParams();
  const endUserId = searchParams.get("userId");
  const authStore = useAuthStore((state) => state);
  useEffect(() => {
    (async () => {
      await addConversation([authStore.endUser._id, endUserId]);
    })();
  }, []);
  return <Navigate to={"/conversations/" + endUserId} />;
};

export default CreateConversation;
