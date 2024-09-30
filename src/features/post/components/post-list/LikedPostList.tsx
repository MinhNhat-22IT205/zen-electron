import React from "react";
import useFetchPostedPosts from "../../hooks/useFetchPostedPosts";
import { useParams } from "react-router-dom";
import { Button } from "@/src/shared/components/shadcn-ui/button";
import useFetchLikedPosts from "../../hooks/useFetchLikedPosts";
import Post from "../Post";

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
  if (error) return <div>Error loading posts: {error.message}</div>;
  return (
    <div>
      {posts?.map((post) => <Post key={post._id} post={post} />)}
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
