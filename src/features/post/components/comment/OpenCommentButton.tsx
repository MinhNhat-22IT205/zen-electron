import { Button } from "@/src/shared/components/shadcn-ui/button";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import React from "react";
import CommentDialog from "./CommentDialog";
import { PostJson } from "@/src/shared/types/post.type";

type OpenCommentButtonProps = {
  post: PostJson;
};

const OpenCommentButton = ({ post }: OpenCommentButtonProps) => {
  const [isCommentOpen, setIsCommentOpen] = React.useState(false);
  const open = () => setIsCommentOpen(true);
  const close = () => setIsCommentOpen(false);
  return (
    <>
      <Button variant="ghost" onClick={open}>
        <ChatBubbleIcon className="h-4 w-4 mr-2" />
      </Button>
      {isCommentOpen && (
        <CommentDialog
          isOpen={isCommentOpen}
          onChange={(isOpen) => {
            if (!isOpen) {
              close();
            } else {
              open();
            }
          }}
          post={post}
        />
      )}
    </>
  );
};

export default OpenCommentButton;
