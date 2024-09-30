import { ADD_COMMENT_API_ENDPOINT } from "./comment-endpoints.api";
import http from "@/src/shared/libs/axios/axios.base";
const createComment = async (
  postId: string,
  content: string,
  parentCommentId?: string,
) => {
  try {
    const payload = {
      postId,
      content,
      ...(parentCommentId && { parentCommentId }),
    };

    const result = await http.post(ADD_COMMENT_API_ENDPOINT, payload);

    return result;
  } catch (e) {
    console.error("Error creating comment:", e);
    throw e;
  }
};

export { createComment };
