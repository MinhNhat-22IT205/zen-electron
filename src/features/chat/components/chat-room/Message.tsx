import React, { useEffect, useRef, useState } from "react";
import { Message as MessageType } from "@/src/shared/types/message.type";
import { useAuthStore } from "@/src/shared/libs/zustand/auth.zustand";
import { useDisclosure } from "@/src/shared/hooks/use-disclosure";
import { formatMessageTimestamp } from "@/src/shared/helpers/format-message-date";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/shared/components/shadcn-ui/avatar";
import { IMAGE_BASE_URL } from "@/src/shared/constants/base-paths";
import FileDisplay from "@/src/shared/components/FileDisplay";
import { getFileType } from "@/src/shared/helpers/get-file-type";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/src/shared/components/shadcn-ui/context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/shared/components/shadcn-ui/dialog";
import { Input } from "@/src/shared/components/shadcn-ui/input";
import { Label } from "@/src/shared/components/shadcn-ui/label";
import { Button } from "@/src/shared/components/shadcn-ui/button";
type MessageProps = {
  message: MessageType;
  previousMessage: MessageType | null;
  seenMessage: (messageId: string) => void;
  emitDeleteMessage: (
    messageId: string,
    conversationId: string,
  ) => Promise<void>;
  emitChangeMessage: (
    content: string,
    messageId: string,
    conversationId: string,
  ) => Promise<void>;
};
const Message = ({
  message,
  previousMessage,
  seenMessage,
  emitChangeMessage,
  emitDeleteMessage,
}: MessageProps) => {
  const { isOpen, toggle } = useDisclosure(false);
  const [openChangingText, setOpenChangingText] = useState(false);
  const [text, setText] = useState("");
  const myUserId = useAuthStore((state) => state.endUser?._id);
  const isMe = message.endUserId?._id === myUserId;

  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = messageRef.current;
    if (!element) return; // Ensure element exists

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !message.read && !isMe) {
          seenMessage(message._id); // Call the function when visible
        }
      },
      {
        threshold: 0.1, // 10% visibility required
        rootMargin: "0px 0px -20px 0px", // Start observing slightly before full visibility
      },
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element); // Cleanup observer when component unmounts or element changes
      }
    };
  }, [message._id, seenMessage]);
  console.log(openChangingText);
  return (
    <div>
      {openChangingText && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Change message</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Change message</DialogTitle>
              <DialogDescription>We just change message</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="message" className="text-right">
                  message
                </Label>
                <Input
                  id="message"
                  defaultValue=""
                  onChange={(e) => setText(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={() => {
                  emitChangeMessage(text, message._id, message.conversationId);
                  setOpenChangingText(false);
                }}
              >
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      <div
        ref={messageRef}
        className={`flex flex-col p-2 ${isMe ? "items-end " : "items-start "}`}
      >
        <div>
          {!isMe &&
            (!previousMessage ||
              previousMessage.endUserId._id !== message.endUserId._id) && (
              <p className="text-sm text-gray-500 ml-10">
                {message.endUserId?.username}
              </p>
            )}
          <div className="flex items-end gap-2">
            {!isMe && (
              <div className="flex items-center gap-2 mb-1">
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={IMAGE_BASE_URL + message.endUserId?.avatar}
                    alt={message.endUserId?.username}
                  />
                  <AvatarFallback>
                    {message.endUserId?.username?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
            <ContextMenu>
              <ContextMenuTrigger>
                <div
                  onClick={toggle}
                  className={`px-2.5 py-1.5 rounded-xl cursor-pointer ${message.type != "text" && "!bg-white"} ${isMe ? " bg-blue-500 text-white !rounded-br-none" : " bg-gray-200 !rounded-bl-none"}`}
                >
                  {message.type === "text" ? (
                    message.content
                  ) : getFileType(message.content) !== "image" ? (
                    <FileDisplay
                      filename={message.content.split(" ").pop()}
                      fileUrl={IMAGE_BASE_URL + message.content}
                    />
                  ) : (
                    <img
                      src={IMAGE_BASE_URL + message.content}
                      className="w-40 h-40"
                      alt="file"
                    />
                  )}
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem
                  onClick={() =>
                    emitDeleteMessage(message._id, message.conversationId)
                  }
                >
                  Delete
                </ContextMenuItem>
                <ContextMenuItem onClick={() => setOpenChangingText(true)}>
                  Change
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </div>
        </div>
        {isOpen && (
          <div
            className={`flex justify-end text-sm text-gray-500 ${!isMe && "ml-10"}`}
          >
            {formatMessageTimestamp(new Date(message.createdAt))}
          </div>
        )}
        {isOpen && isMe && (
          <div className="flex justify-end text-sm text-gray-500">
            {message.read ? "Received" : "Sent"}
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
