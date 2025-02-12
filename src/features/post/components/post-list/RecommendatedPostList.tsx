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
import { ArrowDownIcon } from "@radix-ui/react-icons";

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

  if (error)
    return (
      <div className="text-red-500 p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
        Error loading posts: {error.message}
      </div>
    );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center mb-2">
        <Heading>
          <button
            onClick={refreshPosts}
            className="text-xl font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Posts
          </button>
        </Heading>
      </div>

      <div className="space-y-4">
        {posts?.map((post) => <Post key={post._id} post={post} />)}
      </div>

      {isLoadingMore && (
        <div className="flex justify-center py-4">
          <div className="animate-pulse text-gray-500 dark:text-gray-400">
            Loading more posts...
          </div>
        </div>
      )}

      {posts?.length != 0 && !isReachingEnd && (
        <div className="flex justify-center pt-2">
          <Button
            variant="secondary"
            onClick={fetchMorePosts}
            className="gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Load more
            <ArrowDownIcon className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecommendatedPostList;
