import http from "@/src/shared/libs/axios/axios.base";
import { ADD_LIKE_API_ENDPOINT } from "./like-endpoints.api";

const toggleLike = async (postId: string) => {
  try {
    const result = await http.post(ADD_LIKE_API_ENDPOINT, { postId: postId });
    return result.data;
  } catch (error) {
    console.error(error);
  }
};
export { toggleLike };
