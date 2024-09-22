import { Button } from "@/src/shared/components/shadcn-ui/button";
import { Input } from "@/src/shared/components/shadcn-ui/input";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import React from "react";

type CommentInputProps = {
  replyingUsername: string;
  onChangeInput: (newInput: string) => void;
  onCancelReplying: () => void;
  onCreateComment: () => void;
};
const CommentInput = ({
  replyingUsername,
  onChangeInput,
  onCancelReplying,
  onCreateComment,
}: CommentInputProps) => {
  return (
    <>
      {replyingUsername && (
        <div className="flex px-5 border-t border-gray-300 mt-1 gap-1 items-center text-lg">
          <p>
            Replying to <span className="font-bold">{replyingUsername}</span>
          </p>

          <Button
            variant="ghost"
            size="lg"
            className="font-bold text-gray-400 "
            onClick={() => {
              onCancelReplying();
            }}
          >
            • Cancel
          </Button>
        </div>
      )}
      <div className="flex px-2">
        <Input
          className="focus:!outline-none focus-visible:!ring-0 flex-1"
          type="text"
          placeholder="Write your comment"
          onChange={(e) => onChangeInput(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onCreateComment();
              e.currentTarget.value = "";
            }
          }}
        />
        <Button variant="ghost">
          <PaperPlaneIcon className="w-4 h-4" />
        </Button>
      </div>
    </>
  );
};

export default CommentInput;
