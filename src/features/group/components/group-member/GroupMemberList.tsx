import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { useParams, useSearchParams } from "react-router-dom";
import { GroupMember } from "@/src/shared/types/group.type";
import {
  deleteGroupMember,
  GROUP_MEMBER_API_ENDPOINT,
} from "../../api/group-member.api";
import { fetcher } from "@/src/shared/libs/swr/fetcher";
import GroupMemberItem from "./GroupMemberItem";
import { useAuthStore } from "@/src/shared/libs/zustand/auth.zustand";

const GroupMemberList = () => {
  const { id: groupId } = useParams();
  const [searchParams] = useSearchParams();
  const isOwner = (searchParams.get("isOwner") ?? "false") === "true";
  const endUserId = useAuthStore((state) => state.endUser?._id);
  const { data, isLoading, mutate, error } = useSWR<GroupMember[]>(
    `${GROUP_MEMBER_API_ENDPOINT}/${groupId}?limit=1000&skip=0`,
    fetcher,
  );
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  useEffect(() => {
    //remove duplicate group members
    const uniqueGroupMembers = data?.filter(
      (groupMember, index, self) =>
        index ===
        self.findIndex((t) => t.endUser._id === groupMember.endUser._id),
    );
    setGroupMembers(uniqueGroupMembers);
  }, [data]);

  if (isLoading) return <h1>Loading...</h1>;
  if (error) return <h1>{error.message}</h1>;
  console.log(groupMembers);
  return (
    <>
      <h1 className="text-2xl font-bold">Group Members</h1>
      {groupMembers?.map((groupMember) => (
        <GroupMemberItem
          key={groupMember._id}
          groupMember={groupMember}
          isOwner={isOwner}
          onDelete={async () => {
            await deleteGroupMember(groupMember.endUser._id, groupId, mutate);
          }}
        />
      ))}
    </>
  );
};

export default GroupMemberList;
