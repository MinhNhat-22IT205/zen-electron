import { fetcher } from "@/src/shared/libs/swr/fetcher";
import { JoinGroupRequest } from "@/src/shared/types/join-group-request.type";
import React from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import { GROUP_MEMBER_REQUEST_API } from "../../api/group-request.api";
import JoinGroupRequestItem from "./JoinGroupRequestItem";

const JoinGroupRequestList = () => {
  const { id: groupId } = useParams();
  const {
    data: joinGroupRequests,
    isLoading,
    error,
    mutate,
  } = useSWR<JoinGroupRequest[]>(
    `${GROUP_MEMBER_REQUEST_API}/${groupId}?limit=100&skip=0`,
    fetcher,
  );

  if (isLoading) return <h1>Loading...</h1>;
  if (error) return <h1>{error.message}</h1>;

  return (
    <>
      <h1 className="text-2xl font-bold">Join Group Requests</h1>
      {joinGroupRequests?.map((joinGroupRequest) => (
        <JoinGroupRequestItem
          key={joinGroupRequest._id}
          joinGroupRequest={joinGroupRequest}
          onMutate={mutate}
        />
      ))}
    </>
  );
};

export default JoinGroupRequestList;
