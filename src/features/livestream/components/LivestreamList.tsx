import { fetcher } from "@/src/shared/libs/swr/fetcher";
import { PopulatedLivestream } from "@/src/shared/types/livestream.type";
import React from "react";
import useSWR from "swr";
import { LIVESTREAM_API_ENDPOINT } from "../api/livestream-endpoint.api";
import LivestreamItem from "./LivestreamItem";
import { ScrollArea } from "@/src/shared/components/shadcn-ui/scroll-area";

const LivestreamList = () => {
  const { data: livestreams, error } = useSWR<PopulatedLivestream[]>(
    LIVESTREAM_API_ENDPOINT + "?limit=100&skip=0",
    fetcher,
    { refreshInterval: 2000 },
  );
  if (error) return <div>{error?.message}</div>;
  if (!livestreams) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-2">
      {livestreams.map((livestream) => (
        <LivestreamItem key={livestream._id} livestream={livestream} />
      ))}
    </div>
  );
};

export default LivestreamList;
