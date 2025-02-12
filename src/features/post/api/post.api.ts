import http from "@/src/shared/libs/axios/axios.base";
import { PostJson } from "@/src/shared/types/post.type";
import { ztAddPostInputs } from "../lib/add-feed.zod";
import { ADD_POST_API_ENDPOINT } from "./post-endpoints.api";

const addPost = async (values: ztAddPostInputs) => {
  try {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("body", values.body);

    console.log(values.images, typeof values.images[0]);

    // Append each image file
    if (values.images) {
      if (typeof values.images[0] == "string") {
        Array.from(values.images as string[]).forEach((imageLink) => {
          console.log(imageLink);
          formData.append("images", imageLink);
        });
      } else {
        Array.from(values.images as File[]).forEach((file) => {
          formData.append("files", file);
        });
      }
    }
    if (values.groupId) {
      formData.append("groupId", values.groupId);
    }
    if (values.fromEndUserId) {
      formData.append("fromEndUserId", values.fromEndUserId);
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

const editPost = async (postId: string, values: ztAddPostInputs) => {
  try {
    const formData = new FormData();
    formData.append("postId", postId);
    formData.append("title", values.title);
    formData.append("body", values.body);

    console.log(values.images, typeof values.images[0]);

    // Append each image file
    if (values.images) {
      if (typeof values.images[0] == "string") {
        Array.from(values.images as string[]).forEach((imageLink) => {
          console.log(imageLink);
          formData.append("images", imageLink);
        });
      } else {
        Array.from(values.images as File[]).forEach((file) => {
          formData.append("files", file);
        });
      }
    }
    if (values.groupId) {
      formData.append("groupId", values.groupId);
    }
    if (values.fromEndUserId) {
      formData.append("fromEndUserId", values.fromEndUserId);
    }
    const result = await http.patch<PostJson>(ADD_POST_API_ENDPOINT, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return result.data;
  } catch (error) {
    return error.response.data;
  }
};

const deletePost = async (postId: string) => {
  try {
    const result = await http.delete(ADD_POST_API_ENDPOINT + "/" + postId);
    return result.data;
  } catch (error) {
    return error.response.data;
  }
};
export { addPost, deletePost, editPost };
