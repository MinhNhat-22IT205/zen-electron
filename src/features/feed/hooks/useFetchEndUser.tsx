import { fetcher } from "@/src/shared/libs/swr/fetcher";
import { useAuthStore } from "@/src/shared/libs/zustand/auth.zustand";
import {
  EndUserProfile,
  EndUserProfileMinimal,
} from "@/src/shared/types/enduser.type";

import useSWR from "swr";

export default function useFetchEndUser(endUserId: string): {
  endUser: EndUserProfileMinimal;
  isLoading: boolean;
  error: boolean;
  isMyProfile: boolean;
  mutate: () => void;
} {
  const myEndUser = useAuthStore((state) => state.endUser);
  const isMyProfile = endUserId == myEndUser._id;
  if (!isMyProfile) {
    const { data, isLoading, error, mutate } = useSWR<EndUserProfile>(
      "/profile/" + endUserId + "?limit=100&skip=0",
      fetcher,
      { refreshInterval: 2000 },
    );
    return {
      endUser: data
        ? { isFriend: data?.isFriend ?? false, ...data?.endUser }
        : null,
      isLoading,
      error,
      isMyProfile,
      mutate,
    };
  } else {
    return {
      endUser: { isFriend: false, ...myEndUser },
      isLoading: false,
      error: false,
      isMyProfile,
      mutate: () => {},
    };
  }
}
