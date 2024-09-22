import React from "react";

import {
  BookmarkIcon,
  ChatBubbleIcon,
  DotsHorizontalIcon,
  HeartIcon,
  Share1Icon,
} from "@radix-ui/react-icons";
import FeedImages from "./FeedImages";
import { Card, CardContent } from "@/src/shared/components/shadcn-ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/shared/components/shadcn-ui/avatar";
import Text from "@/src/shared/components/shadcn-ui/text";
import { Button } from "@/src/shared/components/shadcn-ui/button";
import { Post, PostJson } from "@/src/shared/types/feed.type";
import { timeAgo } from "@/src/shared/helpers/timeAgo";
import { toggleLike as toggleLikeApiCall } from "../api/like.api";
import CommentDialog from "./comment/CommentDialog";
import { IMAGE_BASE_URL } from "@/src/shared/constants/base-paths";
import { useNavigate } from "react-router-dom";

type FeedProps = {
  feed: PostJson;
};

const Feed = ({ feed }: FeedProps) => {
  const navigate = useNavigate();
  const [isCommentOpen, setIsCommentOpen] = React.useState(false);
  const open = () => setIsCommentOpen(true);
  const close = () => setIsCommentOpen(false);
  const [isLiked, setIsLiked] = React.useState(feed.hasLiked);
  const [numOfLikes, setNumOfLikes] = React.useState(feed.numOfLikes);

  const toggleLike = async () => {
    setIsLiked((prev) => !prev);
    setNumOfLikes((prev) => (isLiked ? prev - 1 : prev + 1));
    await toggleLikeApiCall(feed._id);
  };

  return (
    <>
      <Card>
        <CardContent>
          <div className="flex items-center justify-between gap-3 mt-2 mb-2">
            <Avatar
              className="cursor-pointer"
              onClick={() => navigate("/user-profile/" + feed.endUser._id)}
            >
              <AvatarImage
                src={IMAGE_BASE_URL + feed.endUser.avatar}
                alt="User Avatar"
              />
              <AvatarFallback>{feed.endUser.username.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <Text className="">{feed.endUser.username}</Text>
              <Text className="text-gray-500 !mt-0">
                {timeAgo(new Date(feed.createdAt))}
              </Text>
            </div>
            <div className="flex-1 justify-end flex">
              <Button variant="ghost">
                <DotsHorizontalIcon className=" h-4 w-4" />
              </Button>
            </div>
          </div>

          <Text className="font-bold text-2xl">{feed.title}</Text>
          <Text>{feed.body}</Text>
          <FeedImages images={feed.images} />
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              className={isLiked ? "text-pink-500" : ""}
              onClick={toggleLike}
            >
              <HeartIcon className="h-4 w-4 mr-2" /> {numOfLikes}
            </Button>
            <Button variant="ghost" onClick={open}>
              <ChatBubbleIcon className="h-4 w-4 mr-2" />
            </Button>
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
      <CommentDialog
        isOpen={isCommentOpen}
        onChange={(isOpen) => {
          if (!isOpen) {
            close();
          } else {
            open();
          }
        }}
        post={feed}
      />
    </>
  );
};

export default Feed;
