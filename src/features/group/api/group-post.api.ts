import { PostJson } from "@/src/shared/types/post.type";
import { ztAddGroupPostInputs } from "../libs/add-group-post.zod";
import http from "@/src/shared/libs/axios/axios.base";

const addGroupPost = async (data: ztAddGroupPostInputs) => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("body", data.body);
  if (data.groupId) {
    formData.append("groupId", data.groupId);
  }
  if (data.images) {
    Array.from(data.images).forEach((file) => {
      formData.append("files", file);
    });
  }
  try {
    const result = await http.post<PostJson>("/post", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return result.data;
  } catch (error) {
    console.error(error.response.data);
    throw error;
  }
};

export { addGroupPost };
