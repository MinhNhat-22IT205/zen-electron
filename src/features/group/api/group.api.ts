import { Group } from "@/src/shared/types/group.type";
import { ztAddGroupInputs } from "../libs/add-group.zod";
import http from "@/src/shared/libs/axios/axios.base";

export const GROUPS_API_ENDPOINT = "/groups";
const GROUP_API_ENDPOINT = "/group";

const createGroup = async (data: ztAddGroupInputs): Promise<Group> => {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("isVisible", data.isVisible.toString());
    formData.append("files", data.image);
    const response = await http.post<Group>(GROUP_API_ENDPOINT, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error.response.data);
    throw error;
  }
};

export { createGroup };
