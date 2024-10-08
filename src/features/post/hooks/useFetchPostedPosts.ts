import { fetcher } from "@/src/shared/libs/swr/fetcher";
import { PostJson } from "@/src/shared/types/post.type";
import useSWRInfinite from "swr/infinite";
import { GET_USER_CREATED_POSTS_API_ENDPOINT } from "../api/post-endpoints.api";
const POSTS_PER_FETCH = 8;
export default function useFetchPostedPosts(endUserId: string) {
  const getKey = (pageIndex: any, previousPageData: any) => {
    //end of page?
    if (pageIndex && !previousPageData.length) return null;
    return (
      GET_USER_CREATED_POSTS_API_ENDPOINT +
      endUserId +
      `?limit=${pageIndex * POSTS_PER_FETCH + POSTS_PER_FETCH}&skip=${
        pageIndex * POSTS_PER_FETCH
      }`
    );
  };
  //data will be array of pages[[],[],[]], which means newly fetched data will be added to the array
  //size is number of pages
  const { data, mutate, size, setSize, isValidating, isLoading, error } =
    useSWRInfinite(getKey, fetcher, { initialSize: 1 });

  //concat all the pages together
  const posts: PostJson[] = data ? [].concat(...data) : [];
  const isLoadingMore = isLoading;
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < POSTS_PER_FETCH);
  const isRefreshing = isValidating && data && data.length === size;

  const fetchMorePosts = () => {
    setSize(size + 1);
  };
  const refreshPosts = () => {
    mutate();
  };

  return {
    posts,
    error,
    isLoadingMore,
    isReachingEnd,
    isRefreshing,
    refreshPosts,
    fetchMorePosts,
  };
}
