import http from "@/src/shared/libs/axios/axios.base";
import { ztEditProfileInputs } from "../lib/edit-profile.zod";
import { EndUser } from "@/src/shared/types/enduser.type";
import {
  EDIT_PROFILE_AVATAR_API_ENDPOINT,
  EDIT_PROFILE_INFO_API_ENDPOINT,
} from "./profile-endpoints.api";

const editProfileInfo = async (values: ztEditProfileInputs) => {
  console.log("values", values);
  if (values.avatar) {
    try {
      const formData = new FormData();
      formData.append("file", values.avatar);
      const result1 = await http.patch<EndUser>(
        EDIT_PROFILE_AVATAR_API_ENDPOINT,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      const result2 = await http.patch<EndUser>(
        EDIT_PROFILE_INFO_API_ENDPOINT,
        { username: values.username, description: values.description },
      );
      return result2.data;
    } catch (error) {
      return error.response.data;
    }
  } else {
    try {
      const result = await http.patch<EndUser>(
        EDIT_PROFILE_INFO_API_ENDPOINT,
        values,
      );
      return result.data;
    } catch (error) {
      return error.response.data;
    }
  }
};
export { editProfileInfo };
