import { Button } from "../../../../shared/components/shadcn-ui/button";
import { Input } from "../../../../shared/components/shadcn-ui/input";
import { ScrollArea } from "../../../../shared/components/shadcn-ui/scroll-area";
import Text from "../../../../shared/components/shadcn-ui/text";
import {
  CameraIcon,
  ImageIcon,
  Link2Icon,
  PaperPlaneIcon,
  VideoIcon,
} from "@radix-ui/react-icons";
import React from "react";
import MessageList from "./MessageList";

const ChatRoom = () => {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center p-2 border-b">
        <Text className="flex-1 font-bold"> Johnson </Text>
        <div className="flex items-center justify-between">
          <Button variant="ghost">Video</Button>
          <Button variant="ghost">Audio</Button>
        </div>
      </div>
      {/* Chat Messages */}
      <ScrollArea className="flex-1 h-full w-full">
        <MessageList />
      </ScrollArea>
      {/* Chat Input */}
      <div className="flex px-2">
        <Input
          className="focus:!outline-none focus-visible:!ring-0 flex-1"
          type="text"
          placeholder="Type a message"
        />
        <Button variant="ghost">
          <PaperPlaneIcon className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex items-center py-2 px-4 gap-2">
        <Button variant="ghost" className="!p-1 !h-5">
          <ImageIcon className="w-4 h-4" />
        </Button>
        <Button variant="ghost" className="!p-1 !h-5">
          <Link2Icon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatRoom;
