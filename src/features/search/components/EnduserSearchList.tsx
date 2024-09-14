import { ScrollArea } from "@/src/shared/components/shadcn-ui/scroll-area";
import React from "react";
import useSWR from "swr";
import { ENDUSER_SEARCH_API_ENDPOINT } from "../api/search-endpoints.api";
import { fetcher } from "@/src/shared/libs/swr/fetcher";
import { EndUser } from "@/src/shared/types/enduser.type";
import EnduserSearchItem from "./EnduserSearchItem";

type EnduserSearchListProps = {
  searchQuery: string;
};

const EnduserSearchList = ({ searchQuery }: EnduserSearchListProps) => {
  const {
    data: endUsers,
    isLoading,
    error,
  } = useSWR<EndUser[]>(
    ENDUSER_SEARCH_API_ENDPOINT + "?limit=1000&skip=0&search=" + searchQuery,
    fetcher,
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    console.log(error);
    return <div>{error.message}</div>;
  }
  return (
    <ScrollArea className=" h-full w-full">
      <div className="flex flex-col gap-3">
        {endUsers?.map((endUser: EndUser) => (
          <EnduserSearchItem key={endUser._id} endUser={endUser} />
        ))}
      </div>
    </ScrollArea>
  );
};

export default EnduserSearchList;
