import React from "react";

import {
  BookmarkIcon,
  ChatBubbleIcon,
  DotsHorizontalIcon,
  HeartIcon,
  Share1Icon,
} from "@radix-ui/react-icons";
import { Card, CardContent } from "@/src/shared/components/shadcn-ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/shared/components/shadcn-ui/avatar";
import Text from "@/src/shared/components/shadcn-ui/text";
import { Button } from "@/src/shared/components/shadcn-ui/button";
import { Post, PostJson } from "@/src/shared/types/post.type";
import { timeAgo } from "@/src/shared/helpers/timeAgo";
import { IMAGE_BASE_URL } from "@/src/shared/constants/base-paths";
import { useNavigate } from "react-router-dom";
import LikeButton from "./like/LikeButton";
import OpenCommentButton from "./comment/OpenCommentButton";
import PostImages from "./PostImages";
type PostProps = {
  post: PostJson;
};

const Post = ({ post }: PostProps) => {
  const navigate = useNavigate();

  return (
    <>
      <Card>
        <CardContent>
          <div className="flex items-center justify-between gap-3 mt-2 mb-2">
            <Avatar
              className="cursor-pointer"
              onClick={() => navigate("/user-profile/" + post.endUser._id)}
            >
              <AvatarImage
                src={IMAGE_BASE_URL + post.endUser.avatar}
                alt="User Avatar"
              />
              <AvatarFallback>{post.endUser.username.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <Text className="">{post.endUser.username}</Text>
              <Text className="text-gray-500 !mt-0">
                {timeAgo(new Date(post.createdAt))}
              </Text>
            </div>
            <div className="flex-1 justify-end flex">
              <Button variant="ghost">
                <DotsHorizontalIcon className=" h-4 w-4" />
              </Button>
            </div>
          </div>

          <Text className="font-bold text-2xl">{post.title}</Text>
          <Text>{post.body}</Text>
          <PostImages images={post.images} />
          <div className="flex justify-between items-center">
            <LikeButton
              isLiked={post.hasLiked}
              numOfLikes={post.numOfLikes}
              postId={post._id}
            />
            <OpenCommentButton post={post} />
            <Button variant="ghost">
              <Share1Icon className="h-4 w-4 mr-2" />
            </Button>
            <div className="flex-1" />
            <Button variant="ghost">
              <BookmarkIcon className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Post;
