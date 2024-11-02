import React from "react";
import Post from "../Post";
import { ADD_POST_API_ENDPOINT } from "@/src/features/post/api/post-endpoints.api";
import useSWR from "swr";
import { useParams } from "react-router-dom";
import { PostJson, Post as PostType } from "@/src/shared/types/post.type";
const PostIdPage = () => {
  const { id: postId } = useParams();
  const { data: post } = useSWR<PostJson>(`${ADD_POST_API_ENDPOINT}/${postId}`);
  return (
    <>
      <Post post={post} />
    </>
  );
};

export default PostIdPage;
