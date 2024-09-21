import Heading from "../../../shared/components/shadcn-ui/heading";
import React, { useEffect, useRef } from "react";
import Feed from "./Feed";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../shared/components/shadcn-ui/tabs";
import { GET_FEED_API_ENDPOINT } from "../api/feed-endpoints.api";
import { fetcher } from "@/src/shared/libs/swr/fetcher";
import { Post, PostJson } from "@/src/shared/types/feed.type";
import useSWR from "swr";
import { useFetchRecommendationPosts } from "../hooks/useFetchRecommendationPosts";
import { Button } from "@/src/shared/components/shadcn-ui/button";

const FeedList = () => {
  const {
    posts: feeds,
    fetchMorePosts,
    isLoadingMore,
    isRefreshing,
    error,
  } = useFetchRecommendationPosts();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  if (error) return <div>Error loading feeds: {error.message}</div>;
  return (
    <>
      <div className="flex justify-between items-center">
        <Heading>Feeds</Heading>
        <Tabs defaultValue="popular" className="">
          <TabsList>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="latest">Latest</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {feeds?.map((feed) => <Feed key={feed._id} feed={feed} />)}
      {isLoadingMore && <div>Loading...</div>}
      <Button variant="secondary" onClick={fetchMorePosts}>
        Load more
      </Button>
    </>
  );
};

export default FeedList;
