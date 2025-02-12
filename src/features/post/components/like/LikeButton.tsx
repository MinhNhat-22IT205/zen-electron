import { Button } from "@/src/shared/components/shadcn-ui/button";
import { HeartIcon } from "@radix-ui/react-icons";
import React from "react";
import { toggleLike as toggleLikeApiCall } from "../../api/like.api";
import { addStar } from "@/src/features/livestream/api/star.api";
import { Post } from "@/src/shared/types/post.type";
import { useAuthStore } from "@/src/shared/libs/zustand/auth.zustand";

type LikeButtonProps = {
  isLiked: boolean;
  numOfLikes: number;
  post: Post;
};

const LikeButton = ({
  isLiked: initialIsLiked,
  numOfLikes: initialNumOfLikes,
  post,
}: LikeButtonProps) => {
  const [isLiked, setIsLiked] = React.useState(initialIsLiked);
  const [numOfLikes, setNumOfLikes] = React.useState(initialNumOfLikes);
  const { endUser: myEndUser, setEndUser } = useAuthStore();

  const toggleLike = async () => {
    setIsLiked((prev) => !prev);
    setNumOfLikes((prev) => (isLiked ? prev - 1 : prev + 1));
    await toggleLikeApiCall(post._id);
    if (myEndUser._id != post.endUser._id) {
      await addStar(1, myEndUser, setEndUser);
    }
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
