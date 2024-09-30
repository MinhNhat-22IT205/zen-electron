import Heading from "../../../../shared/components/shadcn-ui/heading";
import React, { useEffect, useRef } from "react";
import Post from "../Post";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../shared/components/shadcn-ui/tabs";
import { useFetchRecommendationPosts } from "../../hooks/useFetchRecommendationPosts";
import { Button } from "@/src/shared/components/shadcn-ui/button";

const RecommendatedPostList = () => {
  const {
    posts,
    fetchMorePosts,
    isLoadingMore,
    isRefreshing,
    error,
    isReachingEnd,
    refreshPosts,
  } = useFetchRecommendationPosts();

  if (error) return <div>Error loading posts: {error.message}</div>;
  return (
    <>
      <div className="flex justify-between items-center">
        <Heading>
          <button onClick={refreshPosts}>Posts</button>
        </Heading>
        <Tabs defaultValue="popular" className="">
          <TabsList>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="latest">Latest</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {posts?.map((post) => <Post key={post._id} post={post} />)}
      {isLoadingMore && <div>Loading...</div>}
      {posts?.length != 0 && !isReachingEnd && (
        <Button variant="secondary" onClick={fetchMorePosts}>
          Load more
        </Button>
      )}
    </>
  );
};

export default RecommendatedPostList;
