import http from "@/src/shared/libs/axios/axios.base";
import { PostJson } from "@/src/shared/types/feed.type";
import { ADD_FEED_API_ENDPOINT } from "./feed-endpoints.api";
import { ztAddPostInputs } from "../lib/add-feed.zod";

const addFeed = async (values: ztAddPostInputs) => {
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
    // inputs.images.forEach((uri) => {
    //   const fileName = uri.split("/").pop();
    //   const fileType = fileName.split(".").pop();
    //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //   // @ts-expect-error
    //   formData.append("files", {
    //     uri,
    //     name: fileName,
    //     type: `image/${fileType}`
    //   });
    // });
    const result = await http.post<PostJson>(ADD_FEED_API_ENDPOINT, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return result.data;
  } catch (error) {
    return error.response.data;
  }
};
export { addFeed };
