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

type FeedProps = {
  feed: PostJson;
};

const Feed = ({ feed }: FeedProps) => {
  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between gap-3 mt-2 mb-2">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>{feed.endUser.username}</AvatarFallback>
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
            className={feed.hasLiked ? "text-pink-500" : ""}
          >
            <HeartIcon className="h-4 w-4 mr-2" /> {feed.numOfLikes}
          </Button>
          <Button variant="ghost">
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
  );
};

export default Feed;
