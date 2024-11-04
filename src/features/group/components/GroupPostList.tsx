import React from "react";
import useSWR from "swr";
import { useParams } from "react-router-dom";
import { PostJson } from "@/src/shared/types/post.type";
import { fetcher } from "@/src/shared/libs/swr/fetcher";
import Post from "../../post/components/Post";

const GroupPostList = () => {
  const { id: groupId } = useParams();
  const { data, error, isLoading, mutate } = useSWR<PostJson[]>(
    `/posts/${groupId}?limit=1000&skip=0`,
    fetcher,
  );
  return (
    <div className="space-y-6">
      {data?.map((post) => <Post key={post._id} post={post} />)}
    </div>
  );
};

export default GroupPostList;
