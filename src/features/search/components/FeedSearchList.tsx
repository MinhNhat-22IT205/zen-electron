import { PostJson } from "@/src/shared/types/post.type";
import React from "react";
import useSWR from "swr";
import { FEED_SEARCH_API_ENDPOINT } from "../api/search-endpoints.api";
import { useSearchParams } from "react-router-dom";
import { fetcher } from "@/src/shared/libs/swr/fetcher";
import { ScrollArea } from "@/src/shared/components/shadcn-ui/scroll-area";
import Post from "../../post/components/Post";

const FeedSearchList = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q");
  const {
    data: posts,
    isLoading,
    error,
  } = useSWR<PostJson[]>(
    FEED_SEARCH_API_ENDPOINT +
      "?limit=1000&skip=0&searchKeyWords=" +
      searchQuery,
    fetcher,
  );
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (searchQuery === "") {
    return <div></div>;
  }

  if (error) {
    console.log(error);
    return <div>{error.message}</div>;
  }
  return (
    <ScrollArea className=" h-full w-full">
      <div className="flex flex-col gap-3">
        {posts?.map((post: PostJson) => <Post key={post._id} post={post} />)}
      </div>
    </ScrollArea>
  );
};

export default FeedSearchList;
