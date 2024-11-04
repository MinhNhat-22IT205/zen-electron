import { fetcher } from "@/src/shared/libs/swr/fetcher";
import { PostJson } from "@/src/shared/types/post.type";
import useSWR from "swr";

export default function useFetchGroupPosts(groupId: string) {
  const { data, error, isLoading, mutate } = useSWR<PostJson[]>(
    `/posts/${groupId}?limit=1000&skip=0`,
    fetcher,
  );

  return { posts: data, error, isLoading, mutate };
}
