import { fetcher } from "@/src/shared/libs/swr/fetcher";
import { GroupWithMembershipInfo } from "@/src/shared/types/group.type";
import { useEffect } from "react";
import useSWRInfinite from "swr/infinite";
import { GROUPS_API_ENDPOINT } from "../api/group.api";

const GROUP_PER_FETCH = 6;

export default function useFetchRecommendGroups() {
  const getKey = (
    pageIndex: number,
    previousPageData: GroupWithMembershipInfo[],
  ) => {
    console.log(pageIndex);
    //end of page?
    if (pageIndex && !previousPageData.length) return null;
    return (
      GROUPS_API_ENDPOINT +
      `?limit=${pageIndex * GROUP_PER_FETCH + GROUP_PER_FETCH}&skip=${
        pageIndex * GROUP_PER_FETCH
      }`
    );
  };
  //data will be array of pages[[],[],[]], which means newly fetched data will be added to the array
  //size is number of pages
  const { data, mutate, size, setSize, isValidating, isLoading, error } =
    useSWRInfinite(getKey, fetcher, { initialSize: 1 });

  //concat all the pages together
  const groups: GroupWithMembershipInfo[] = data ? [].concat(...data) : [];
  const isLoadingMore = isLoading;
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < GROUP_PER_FETCH);
  const isRefreshing = isValidating && data && data.length === size;

  const fetchMoreGroup = () => {
    setSize(size + 1);
  };
  const refreshGroups = () => {
    mutate();
  };

  return {
    groups,
    error,
    isLoadingMore,
    isReachingEnd,
    isRefreshing,
    refreshGroups,
    fetchMoreGroup,
  };
}
