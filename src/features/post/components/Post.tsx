import React from "react";
import {
  HeartIcon,
  ChatBubbleIcon,
  Share1Icon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import { Card, CardContent } from "@/src/shared/components/shadcn-ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/shared/components/shadcn-ui/avatar";
import Text from "@/src/shared/components/shadcn-ui/text";
import { Button } from "@/src/shared/components/shadcn-ui/button";
import { PostJson } from "@/src/shared/types/post.type";
import { timeAgo } from "@/src/shared/helpers/timeAgo";
import { IMAGE_BASE_URL } from "@/src/shared/constants/base-paths";
import { useNavigate } from "react-router-dom";
import LikeButton from "./like/LikeButton";
import OpenCommentButton from "./comment/OpenCommentButton";
import PostImages from "./PostImages";
import { usePomodoroStore } from "@/src/shared/libs/zustand/pomodoro-settings";
import SharePostDialog from "./add-post/SharePostDialog";
import { useDisclosure } from "@/src/shared/hooks/use-disclosure";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/shared/components/shadcn-ui/dropdown";
import { useAuthStore } from "@/src/shared/libs/zustand/auth.zustand";
import { deletePost } from "../api/post.api";
import EditPostDialogMenuItem from "./add-post/EditPostDialog";
import { GET_POST_API_ENDPOINT } from "../api/post-endpoints.api";
import { mutate } from "swr";

type PostProps = {
  post: PostJson;
};

const Post = ({ post }: PostProps) => {
  const navigate = useNavigate();
  const { setPomodoroSettings } = usePomodoroStore();
  const {
    isOpen: isShareOpen,
    open: openShare,
    close: closeShare,
  } = useDisclosure();
  const { endUser: myEndUser } = useAuthStore();
  const isPomodoroPost = post.body.includes("<pomodoro>");
  const pomodoroSettings = isPomodoroPost
    ? JSON.parse(post.body.match(/<pomodoro>(.*)<\/pomodoro>/)?.[1] || "{}")
    : {};
  const postBody = isPomodoroPost
    ? post.body.replace(/<pomodoro>.*<\/pomodoro>/, "")
    : post.body;

  const handleUsePomodoroSettings = () => {
    setPomodoroSettings(pomodoroSettings);
    navigate("/pomodoro");
  };
  console.log(post);
  const handleDeletePost = async () => {
    await deletePost(post._id);
  };

  return (
    <>
      <Card className="overflow-hidden border-gray-200 dark:border-gray-800">
        <CardContent className="p-6">
          {post.fromEndUser?._id && (
            <div className="flex items-center gap-2 mb-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
              <Text className="text-sm text-gray-600 dark:text-gray-300">
                Shared from
              </Text>
              <Button
                variant="link"
                className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-0"
                onClick={() =>
                  navigate("/user-profile/" + post.fromEndUser._id)
                }
              >
                {post.fromEndUser.username}
              </Button>
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar
                className="cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                onClick={() => navigate("/user-profile/" + post.endUser._id)}
              >
                <AvatarImage
                  src={IMAGE_BASE_URL + post.endUser.avatar}
                  alt="User Avatar"
                />
                <AvatarFallback>
                  {post.endUser.username.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <Text className="font-semibold">{post.endUser.username}</Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  {timeAgo(new Date(post.createdAt))}
                </Text>
              </div>
            </div>

            {post.endUser._id === myEndUser._id && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <DotsHorizontalIcon className="h-5 w-5 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <EditPostDialogMenuItem currentPost={post} />
                  <DropdownMenuItem
                    onSelect={() => {
                      handleDeletePost();
                      mutate(GET_POST_API_ENDPOINT);
                    }}
                    className="text-red-600 dark:text-red-400"
                  >
                    Delete post
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <Text className="font-bold text-2xl mb-2">{post.title}</Text>
          <Text className="text-gray-700 dark:text-gray-300 mb-4">
            {postBody}
          </Text>

          {isPomodoroPost && (
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-8 rounded-2xl shadow-xl mb-6 text-white">
              <h2 className="text-center text-2xl font-light mb-6 tracking-wide">
                Pomodoro Settings
              </h2>
              <ul className="space-y-2 text-sm opacity-90 mb-6">
                <li className="flex justify-between">
                  <span>Session Length:</span>
                  <span>{pomodoroSettings.sessionLength} minutes</span>
                </li>
                <li className="flex justify-between">
                  <span>Break Length:</span>
                  <span>{pomodoroSettings.breakLength} minutes</span>
                </li>
                <li className="flex justify-between">
                  <span>YouTube Video:</span>
                  <span className="truncate ml-2 max-w-[200px]">
                    {pomodoroSettings.youtubeVideoTitle}
                  </span>
                </li>
              </ul>
              <Button
                className="w-full bg-white/10 hover:bg-white/20 text-white"
                variant="ghost"
                onClick={handleUsePomodoroSettings}
              >
                Use these settings
              </Button>
            </div>
          )}

          <PostImages images={post.images} />

          <div className="flex items-center gap-4 mt-4">
            <LikeButton
              isLiked={post.hasLiked}
              numOfLikes={post.numOfLikes}
              post={post}
            />
            <OpenCommentButton post={post} />
            <Button
              variant="ghost"
              onClick={openShare}
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Share1Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </Button>
          </div>
        </CardContent>

        <SharePostDialog
          isOpen={isShareOpen}
          onChange={(isOpen) => {
            if (!isOpen) {
              closeShare();
            } else {
              openShare();
            }
          }}
          close={closeShare}
          post={post}
        />
      </Card>
    </>
  );
};

export default Post;
