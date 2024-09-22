import React, { useState } from "react";
import { Comment as CommentType } from "@/src/shared/types/comment.type";
import { IMAGE_BASE_URL } from "@/src/shared/constants/base-paths";
import { useNavigate } from "react-router-dom";

type CommentProps = {
  comment: CommentType;
  replyLists: CommentType[];
  onReply: (comment: CommentType) => void;
  onShowReplies: (comment: CommentType) => void;
  replyingComment: CommentType;
};

const Comment = ({
  comment,
  onReply,
  onShowReplies,
  replyLists,
  replyingComment,
}: CommentProps) => {
  const navigate = useNavigate();
  const isBeingReplied = replyingComment?._id === comment._id;
  const [repliesIsOpen, setRepliesIsOpen] = useState(!comment.hasReplies);

  const replies = replyLists.filter(
    (reply) => reply.parentCommentId === comment._id,
  );
  const createdAt = new Date(comment.createdAt).toLocaleDateString();
  return (
    <div
      className={`flex-row w-fit gap-3 mb-2 ${isBeingReplied && "bg-blue-200 p-2 rouded-lg"}`}
    >
      <div className="p-4 bg-gray-100 rounded-2xl shadow-md w-fit">
        <div className="flex">
          <img
            className="w-10 h-10 rounded-full mr-4"
            src={IMAGE_BASE_URL + comment.endUser.avatar}
            alt="User avatar"
            onClick={() => {
              navigate("/user-profile/" + comment.endUser._id);
            }}
          />
          <div>
            <h5 className="text-sm font-semibold">
              {comment.endUser.username}{" "}
              <span className="text-gray-400 text">{createdAt}</span>
            </h5>
            <p className="text-gray-800 text-lg">{comment.content}</p>
          </div>
        </div>

        {repliesIsOpen || !comment.hasReplies ? (
          <button
            onClick={() => onReply(comment)}
            className="text-blue-500 hover:text-blue-700 text-xs"
          >
            Reply
          </button>
        ) : (
          <div className="h-2" />
        )}
      </div>
      {comment.hasReplies && (
        <>
          {!repliesIsOpen ? (
            <button
              className="overflow-hidden ml-16"
              onClick={() => {
                setRepliesIsOpen(true);
                onShowReplies(comment);
              }}
            >
              <p className="font-bold">Show replies...</p>
            </button>
          ) : (
            <div className="ml-10">
              {replies.map((reply) => (
                <Comment
                  key={reply._id}
                  comment={reply}
                  replyLists={replyLists}
                  replyingComment={replyingComment}
                  onReply={(reply) => onReply(reply)}
                  onShowReplies={(reply) => onShowReplies(reply)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Comment;