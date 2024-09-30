import { Button } from "@/src/shared/components/shadcn-ui/button";
import { HeartIcon } from "@radix-ui/react-icons";
import React from "react";
import { toggleLike as toggleLikeApiCall } from "../../api/like.api";

type LikeButtonProps = {
  isLiked: boolean;
  numOfLikes: number;
  postId: string;
};

const LikeButton = ({
  isLiked: initialIsLiked,
  numOfLikes: initialNumOfLikes,
  postId,
}: LikeButtonProps) => {
  const [isLiked, setIsLiked] = React.useState(initialIsLiked);
  const [numOfLikes, setNumOfLikes] = React.useState(initialNumOfLikes);

  const toggleLike = async () => {
    setIsLiked((prev) => !prev);
    setNumOfLikes((prev) => (isLiked ? prev - 1 : prev + 1));
    await toggleLikeApiCall(postId);
  };

  return (
    <Button
      variant="ghost"
      className={isLiked ? "text-pink-500" : ""}
      onClick={toggleLike}
    >
      <HeartIcon className="h-4 w-4 mr-2" /> {numOfLikes}
    </Button>
  );
};

export default LikeButton;
