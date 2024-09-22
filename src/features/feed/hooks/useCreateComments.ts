import http from "@/src/shared/libs/axios/axios.base";
import { useAuthStore } from "@/src/shared/libs/zustand/auth.zustand";
import { Comment } from "@/src/shared/types/comment.type";
import { PostJson } from "@/src/shared/types/feed.type";
import { useState } from "react";

type PropsType = {
  post: PostJson;
  addComment: (newComment: Comment) => void;
  addReply: (newReply: Comment) => void;
  refreshComments: () => void;
};

export function useCreateComments(props: PropsType) {
  const [isCreating, setIsCreating] = useState(false);
  const [input, setInput] = useState<string>("");
  const [replyingComment, setReplyingComment] = useState<Comment>();
  const endUser = useAuthStore((state) => state.endUser);

  const changeInput = (newInput: string) => {
    setInput(newInput);
  };

  const handleChangeReplyingComment = (comment: Comment) => {
    console.log("cancel called");
    setReplyingComment(comment);
  };

  const createComment = async (replyingCommentId: string, input: string) => {
    if (!input) return;
    setIsCreating(true);
    const postId = props.post._id;
    try {
      let result;
      if (replyingCommentId) {
        result = await http.post("comment/", {
          postId,
          content: input,
          parentCommentId: replyingCommentId,
        });

        props.addReply({ ...result.data, endUser, hasReplies: false });
        props.refreshComments();
      } else {
        result = await http.post("comment/", { postId, content: input });
        props.addComment({ ...result.data, endUser });
      }
      console.log("result", result.data);
      setInput("");
      return result;
    } catch (e) {
      console.log(e);
    }
    // if (endUser._id !== props.post.endUser._id) {
    //   await createNotification({
    //     subject: {
    //       _id: endUser._id,
    //       name: endUser.username,
    //       type: "enduser",
    //       image: endUser.avatar
    //     },
    //     verb: "comment",
    //     directObject: {
    //       _id: postId,
    //       type: "post",
    //       name: props.post.title,
    //       image: ""
    //     },
    //     indirectObject: {
    //       _id: props.post.endUser._id,
    //       name: props.post.endUser.username,
    //       type: "enduser",
    //       image: props.post.endUser.avatar
    //     },
    //     referenceLink: `post/${props.post._id}`
    //   });
    // }
    setIsCreating(false);
  };

  return {
    isCreating,
    createComment,
    replyingComment,
    handleChangeReplyingComment,
    input,
    changeInput,
  };
}
