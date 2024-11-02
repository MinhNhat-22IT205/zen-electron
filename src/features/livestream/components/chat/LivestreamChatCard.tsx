import { Card, CardContent } from "@/src/shared/components/shadcn-ui/card";
import { ChevronDownIcon, PaperPlaneIcon } from "@radix-ui/react-icons";
import LivestreamChatMessage from "./LivestreamChatMessage";
import { ScrollArea } from "@/src/shared/components/shadcn-ui/scroll-area";
import { Input } from "@/src/shared/components/shadcn-ui/input";
import { Separator } from "@/src/shared/components/shadcn-ui/seperator";
import { LivestreamMessage } from "@/src/shared/types/message.type";
import { useState } from "react";
import useLivestreamChatSocket from "../../hooks/useLivestreamChatSocket";
import { Button } from "@/src/shared/components/shadcn-ui/button";
import { useAuthStore } from "@/src/shared/libs/zustand/auth.zustand";
import { useParams } from "react-router-dom";
const LivestreamChatCard = () => {
  const endUser = useAuthStore((state) => state.endUser);
  const { id: liveStreamId } = useParams();

  const [messageInput, setMessageInput] = useState("");

  const [messages, setMessages] = useState<LivestreamMessage[]>([]);
  const addMessage = (message: LivestreamMessage) => {
    setMessages((prev) => [...prev, message]);
  };
  const { sendMessage } = useLivestreamChatSocket({
    chatUIController: { addMessage },
  });

  return (
    <Card className="w-80 bg-gray-800 border-l border-gray-700">
      <CardContent className="p-0 flex flex-col h-full">
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          <h2 className="font-semibold">Chat</h2>
          <button className="text-sm text-gray-400 hover:text-white">
            Everyone <ChevronDownIcon className="inline-block ml-1 h-4 w-4" />
          </button>
        </div>
        <ScrollArea className="flex-1 p-4">
          {messages.map((message) => (
            <LivestreamChatMessage
              key={Math.random()}
              name={message.endUser.username}
              message={message.message}
              time={new Date(message.createdAt).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
              avatar={message.endUser.avatar}
            />
          ))}
        </ScrollArea>
        <Separator className="bg-gray-700" />

        <div className="p-4 pt-0">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Send a message"
              className="flex-1 bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400"
              onChange={(e) => setMessageInput(e.target.value)}
            />
            <Button
              onClick={() =>
                sendMessage({
                  message: messageInput,
                  endUser: endUser,
                  liveStreamId,
                  createdAt: new Date(),
                })
              }
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded text-gray-300 hover:text-white"
            >
              <PaperPlaneIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LivestreamChatCard;
