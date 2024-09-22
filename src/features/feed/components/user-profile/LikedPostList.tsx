import React from "react";
import Feed from "../Feed";
import useFetchPostedPosts from "../../hooks/useFetchPostedPosts";
import { useParams } from "react-router-dom";
import { Button } from "@/src/shared/components/shadcn-ui/button";
import useFetchLikedPosts from "../../hooks/useFetchLikedPosts";

const LikedPostList = () => {
  const { id } = useParams();
  const {
    posts,
    isLoadingMore,
    error,
    fetchMorePosts,
    isReachingEnd,
    isRefreshing,
  } = useFetchLikedPosts(id);
  if (isLoadingMore) return <div>Loading...</div>;
  if (error) return <div>Error loading feeds: {error.message}</div>;
  return (
    <div>
      {posts?.map((feed) => <Feed key={feed._id} feed={feed} />)}
      {isLoadingMore && <div>Loading...</div>}
      {posts?.length != 0 && !isReachingEnd && (
        <Button variant="secondary" onClick={fetchMorePosts}>
          Load more
        </Button>
      )}
    </div>
  );
};

export default LikedPostList;
