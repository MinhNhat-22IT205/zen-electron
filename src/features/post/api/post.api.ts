import http from "@/src/shared/libs/axios/axios.base";
import { PostJson } from "@/src/shared/types/post.type";
import { ztAddPostInputs } from "../lib/add-feed.zod";
import { ADD_POST_API_ENDPOINT } from "./post-endpoints.api";

const addPost = async (values: ztAddPostInputs) => {
  try {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("body", values.body);

    // Append each image file
    if (values.images) {
      Array.from(values.images).forEach((file) => {
        formData.append("files", file); // Use the same field name as defined in your server
      });
    }
    const result = await http.post<PostJson>(ADD_POST_API_ENDPOINT, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return result.data;
  } catch (error) {
    return error.response.data;
  }
};
export { addPost };
