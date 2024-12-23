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
import { usePomodoroStore } from "@/src/shared/libs/zustand/pomodoro-settings";
type PostProps = {
  post: PostJson;
};

const Post = ({ post }: PostProps) => {
  const navigate = useNavigate();
  const { setPomodoroSettings } = usePomodoroStore();
  const isPomodoroPost = post.body.includes("<pomodoro>");
  const pomodoroSettings = isPomodoroPost
    ? JSON.parse(post.body.match(/<pomodoro>(.*)<\/pomodoro>/)?.[1] || "{}")
    : {};
  const postBody = isPomodoroPost
    ? post.body.replace(/<pomodoro>.*<\/pomodoro>/, "")
    : post.body;

  const handleUsePomodoroSettings = () => {
    console.log(pomodoroSettings);
    setPomodoroSettings(pomodoroSettings);
    navigate("/pomodoro");
  };

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
             {/* <Button variant="ghost">
                <DotsHorizontalIcon className=" h-4 w-4" />
              </Button>*/}
            </div>
          </div>

          <Text className="font-bold text-2xl">{post.title}</Text>
          <Text className="my-4">{postBody}</Text>
          {isPomodoroPost && (
            <div className="bg-zinc-900/90 p-8 rounded-[32px] shadow-2xl w-[360px] text-white backdrop-blur-sm">
              <h2 className="text-center text-2xl font-light mb-6 tracking-wide">
                Pomodoro Settings Used:
              </h2>
              <ul className="text-sm text-muted-foreground">
                <li>
                  Session Length: {pomodoroSettings.sessionLength} minutes
                </li>
                <li>Break Length: {pomodoroSettings.breakLength} minutes</li>
                <li>YouTube Video: {pomodoroSettings.youtubeVideoTitle}</li>
              </ul>
              <Button
                className="w-full "
                variant="ghost"
                onClick={handleUsePomodoroSettings}
              >
                Use settings
              </Button>
            </div>
          )}
          <PostImages images={post.images} />
          <div className="flex justify-between items-center">
            <LikeButton
              isLiked={post.hasLiked}
              numOfLikes={post.numOfLikes}
              postId={post._id}
            />
            <OpenCommentButton post={post} />
            {/*<Button variant="ghost">
              <Share1Icon className="h-4 w-4 mr-2" />
            </Button>*/}
            <div className="flex-1" />
            {/*<Button variant="ghost">
              <BookmarkIcon className="h-4 w-4" />
            </Button>*/}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Post;
