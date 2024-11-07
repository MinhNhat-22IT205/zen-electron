import Message from "./Message";
import useSWR from "swr";
import { MESSAGE_API_ENDPOINT } from "../../api/chat-endpoints.api";
import { useParams } from "react-router-dom";
import { fetcher } from "@/src/shared/libs/swr/fetcher";
import { Message as MessageType } from "@/src/shared/types/message.type";
import useChatSocket from "../../hooks/useChatSocket";
import { ScrollArea } from "@/src/shared/components/shadcn-ui/scroll-area";
import { Button } from "@/src/shared/components/shadcn-ui/button";
import {
  ImageIcon,
  Link2Icon,
  PaperPlaneIcon,
  Cross2Icon,
  VideoIcon,
  FileTextIcon,
  ArchiveIcon,
  FileIcon,
  QuestionMarkCircledIcon,
} from "@radix-ui/react-icons";
import { Input } from "@/src/shared/components/shadcn-ui/input";
import { useAuthStore } from "@/src/shared/libs/zustand/auth.zustand";
import { useRef, useState } from "react";
import { getFileType } from "@/src/shared/helpers/get-file-type";

const MessageList = () => {
  const { id } = useParams();
  const myEndUserId = useAuthStore((state) => state.endUser?._id);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data: messages, mutate } = useSWR<MessageType[]>(
    MESSAGE_API_ENDPOINT + `?limit=1000&skip=0&conversationId=${id}`,
    fetcher,
  );

  const addMessageToUI = (message: MessageType) => {
    mutate((prev) => [...prev, message], false);
  };
  const setSeen = (messageId: string) => {
    mutate((previousMessages) => {
      if (!previousMessages) return previousMessages;

      const updatedMessages = previousMessages.map((message) => {
        const isTargetMessage = message._id === messageId;
        if (isTargetMessage) {
          return { ...message, read: true };
        }
        return message;
      });

      return updatedMessages;
    }, false);
  };

  const { emitMessage, seenMessage, emitFileMessage } = useChatSocket({
    conversationId: id,
    uiControl: {
      addMessageToUI,
      setSeenToUI: setSeen,
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const FileTypeIcon = (fileType: string) => {
    switch (fileType) {
      case "image":
        return <ImageIcon className="h-6 w-6" />;
      case "video":
        return <VideoIcon className="h-6 w-6" />;
      case "audio":
        return <VideoIcon className="h-6 w-6" />;
      case "pdf":
        return <FileTextIcon className="h-6 w-6" />;
      case "document":
        return <FileIcon className="h-6 w-6" />;
      case "compressed":
        return <ArchiveIcon className="h-6 w-6" />;
      default:
        return <QuestionMarkCircledIcon className="h-6 w-6" />;
    }
  };

  return (
    <>
      <ScrollArea className="flex-1 h-full w-full">
        <div className="">
          {messages?.map((message, index) => (
            <Message
              key={message._id}
              message={message}
              seenMessage={seenMessage}
              previousMessage={index > 0 ? messages[index - 1] : null}
            />
          ))}
        </div>
      </ScrollArea>
      {/* Chat Input */}
      <div className="flex px-2 py-2">
        {selectedFile ? (
          <div className="flex-1 flex items-center gap-2 border rounded-md p-2">
            {getFileType(selectedFile.name) === "image" ? (
              <img
                src={previewUrl!}
                alt="Preview"
                className="h-10 w-10 object-cover rounded"
              />
            ) : (
              FileTypeIcon(getFileType(selectedFile.name))
            )}
            <span className="flex-1 truncate">{selectedFile.name}</span>
            <Button variant="ghost" size="sm" onClick={clearSelectedFile}>
              <Cross2Icon className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <Input
            className="focus:!outline-none focus-visible:!ring-0 flex-1"
            type="text"
            placeholder="Type a message"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                emitMessage(e.currentTarget.value, myEndUserId);
                e.currentTarget.value = "";
              }
            }}
          />
        )}
        <Button
          variant="ghost"
          onClick={() =>
            selectedFile && emitFileMessage(selectedFile, myEndUserId)
          }
        >
          <PaperPlaneIcon className="w-4 h-4" />
        </Button>
      </div>
      {/* File send control panel */}
      <div className="flex items-center py-1 px-4 gap-2">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileSelect}
        />
        <Button
          variant="ghost"
          className="!p-1 !h-5"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="w-4 h-4" />
        </Button>
        <Button variant="ghost" className="!p-1 !h-5">
          <Link2Icon className="w-4 h-4" />
        </Button>
      </div>
    </>
  );
};

export default MessageList;
