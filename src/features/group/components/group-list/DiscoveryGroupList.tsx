import React from "react";
import useFetchRecommendGroups from "../../hooks/useFetchRecommendGroups";
import GroupCardItem from "../GroupCardItem";

const DiscoveryGroupList = () => {
  const { groups, isLoadingMore, error } = useFetchRecommendGroups();
  if (isLoadingMore) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <>
      {groups?.map((group) => <GroupCardItem key={group._id} group={group} />)}
    </>
  );
};

export default DiscoveryGroupList;
