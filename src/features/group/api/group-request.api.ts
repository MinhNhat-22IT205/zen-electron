import http from "@/src/shared/libs/axios/axios.base";

export const GROUP_MEMBER_REQUEST_API = "/group-member-requests";

const createGroupRequest = async (groupId: string) => {
  try {
    const result = await http.post(GROUP_MEMBER_REQUEST_API, {
      groupId,
    });
    return result.data;
  } catch (error) {
    console.log(error.response.data);
  }
};

const acceptJoinGroupRequest = async (endUserId: string, groupId: string) => {
  try {
    const response = await http.patch(`/group-member-requests/accept`, {
      endUserId,
      groupId,
    });
    return response.data;
  } catch (error) {
    console.log(error.response.data);
  }
};

const declineJoinGroupRequest = async (endUserId: string, groupId: string) => {
  try {
    const response = await http.patch(`/group-member-requests/decline`, {
      endUserId,
      groupId,
    });
    return response.data;
  } catch (error) {
    console.log(error.response.data);
  }
};

export { createGroupRequest, acceptJoinGroupRequest, declineJoinGroupRequest };
