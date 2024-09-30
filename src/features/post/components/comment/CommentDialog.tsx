import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/components/shadcn-ui/dialog";
import React, { useEffect, useRef } from "react";
import { useFetchComments } from "../../hooks/useFetchComments";
import { useFetchReplies } from "../../hooks/useFetchReplies";
import Comment from "./Comment";
import { Input } from "@/src/shared/components/shadcn-ui/input";
import { ScrollArea } from "@/src/shared/components/shadcn-ui/scroll-area";
import { useCreateComments } from "../../hooks/useCreateComments";
import { PostJson } from "@/src/shared/types/post.type";
import { useAuthStore } from "@/src/shared/libs/zustand/auth.zustand";
import { Button } from "@/src/shared/components/shadcn-ui/button";
import { set } from "react-hook-form";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import CommentInput from "./CommentInput";

type CommentDialogProps = {
  isOpen: boolean;
  onChange: (isOpen: boolean) => void;
  post: PostJson;
};

const CommentDialog = ({ isOpen, onChange, post }: CommentDialogProps) => {
  const {
    comments,
    fetchMoreComments,
    refreshComments,
    isRefreshing,
    addComment,
    isReachingEnd,
  } = useFetchComments({
    postId: post._id,
  });

  const { replyLists, fetchReplies, addReply } = useFetchReplies();

  const {
    createComment,
    replyingComment,
    handleChangeReplyingComment,
    input,
    changeInput,
  } = useCreateComments({
    post,
    addComment,
    addReply,
    refreshComments,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent className="sm:max-w-[500px] h-4/5 flex flex-col">
        <DialogHeader>
          <DialogTitle>
            <button className="w-fit ml-auto" onClick={refreshComments}>
              Comments
            </button>
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 h-full w-full">
          {comments.map((comment) => (
            <Comment
              replyLists={replyLists}
              key={comment._id}
              comment={comment}
              replyingComment={replyingComment}
              onReply={(comment) => handleChangeReplyingComment(comment)}
              onShowReplies={(comment) => {
                fetchReplies(comment);
              }}
              isFirst={true}
            />
          ))}
          {comments.length > 8 && !isReachingEnd && (
            <Button
              variant="secondary"
              onClick={() => fetchMoreComments()}
              className="w-full text-center"
            >
              Load more comments
            </Button>
          )}
        </ScrollArea>

        <CommentInput
          replyingUsername={replyingComment?.endUser.username}
          onCancelReplying={() => handleChangeReplyingComment(null)}
          onChangeInput={(value) => changeInput(value)}
          onCreateComment={() => {
            createComment(replyingComment?._id, input);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
