import React from "react";
import useFetchYourGroups from "../../hooks/useFetchYourGroups";
import GroupCardItem from "../GroupCardItem";

const YourGroupList = () => {
  const { groups, isLoadingMore, error } = useFetchYourGroups();
  if (isLoadingMore) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <>
      {groups?.map((group) => <GroupCardItem key={group._id} group={group} />)}
    </>
  );
};

export default YourGroupList;
