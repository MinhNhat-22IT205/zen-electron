import http from "@/src/shared/libs/axios/axios.base";
import { GroupMember } from "@/src/shared/types/group.type";
import { KeyedMutator, MutatorOptions } from "swr";

export const GROUP_MEMBER_API_ENDPOINT = "/group-members";

const deleteGroupMemberApi = async (endUserId: string, groupId: string) => {
  const response = await http.delete(
    `${GROUP_MEMBER_API_ENDPOINT}/${groupId}/${endUserId}`,
  );
  const deleted = response.data;
  return deleted;
};
const deleteGroupMemberOptions = (
  endUserId: string,
): boolean | MutatorOptions => {
  return {
    optimisticData: (data: GroupMember[]) =>
      data.filter((groupMember) => groupMember.endUser._id !== endUserId),
    rollbackOnError: true,
    populateCache: (data: GroupMember[]) => data,
    revalidate: false,
  };
};
const deleteGroupMember = async (
  endUserId: string,
  groupId: string,
  mutate: KeyedMutator<GroupMember[]>,
) => {
  await mutate(async (data: GroupMember[]) => {
    await deleteGroupMemberApi(endUserId, groupId);
    return data.filter((groupMember) => groupMember.endUser._id !== endUserId);
  }, deleteGroupMemberOptions(endUserId));
};

const leaveGroupApi = async (groupId: string) => {
  console.log("leaveGroupApi", groupId);
  const response = await http.delete(
    `${GROUP_MEMBER_API_ENDPOINT}/leave-group/${groupId}`,
  );
};

export { deleteGroupMember, leaveGroupApi };
