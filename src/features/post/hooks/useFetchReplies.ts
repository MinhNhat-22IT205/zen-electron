import http from "@/src/shared/libs/axios/axios.base";
import { Comment } from "@/src/shared/types/comment.type";
import { useState } from "react";
import { GET_COMMENT_API_ENDPOINT } from "../api/comment-endpoints.api";

export function useFetchReplies() {
  const [replyLists, setReplyLists] = useState<Comment[]>([]);
  const addReply = (newReply: Comment) => {
    setReplyLists([...replyLists, newReply]);
  };
  const fetchReplies = async (comment: Comment) => {
    try {
      const result = await http.get(
        `${GET_COMMENT_API_ENDPOINT}?limit=100&skip=0&postId=${comment.postId}&parentCommentId=${comment._id}`,
      );

      setReplyLists([...replyLists, ...result.data]);
      return result;
    } catch (e) {
      console.log(e);
    }
  };

  return {
    fetchReplies,
    replyLists,
    addReply,
  };
}
