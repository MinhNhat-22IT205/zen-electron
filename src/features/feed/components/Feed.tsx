import React from "react";
import { Card, CardContent } from "../../../shared/components/shadcn-ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../shared/components/shadcn-ui/avatar";
import Text from "../../../shared/components/shadcn-ui/text";
import { Button } from "../../../shared/components/shadcn-ui/button";
import {
  BookmarkIcon,
  ChatBubbleIcon,
  DotsHorizontalIcon,
  HeartIcon,
  Share1Icon,
} from "@radix-ui/react-icons";
import FeedImages from "./FeedImages";

const Feed = () => {
  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between gap-3 mt-2 mb-2">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <Text className="">Chanlie Ward</Text>
            <Text className="text-gray-500 !mt-0">Just now</Text>
          </div>
          <div className="flex-1 justify-end flex">
            <Button variant="ghost">
              <DotsHorizontalIcon className=" h-4 w-4" />
            </Button>
          </div>
        </div>
        <FeedImages
          images={[
            "https://digital.nix.edu.vn/img/brand/logo.svg",
            "https://digital.nix.edu.vn/img/brand/logo.svg",
          ]}
        />
        <Text>
          a long text that is supposed to be a caption for the image that was
          just posted by the user on the feed of the app that is being built by
          the developer who is writing this code. The text is long enough to be
          able to test the overflow of the text and see how it looks when it is
          cut off. The text is long enough to be able to test the overflow of
          the text and see how it looks when it is cut off.
        </Text>
        <div className="flex justify-between items-center">
          <Button variant="ghost">
            <HeartIcon className="h-4 w-4 mr-2" /> 4.5k
          </Button>
          <Button variant="ghost">
            <ChatBubbleIcon className="h-4 w-4 mr-2" /> 1.2k
          </Button>
          <Button variant="ghost">
            <Share1Icon className="h-4 w-4 mr-2" /> 1.2k
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
