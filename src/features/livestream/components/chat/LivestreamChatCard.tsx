import { Card, CardContent } from "@/src/shared/components/shadcn-ui/card";
import { ChevronDownIcon, PaperPlaneIcon } from "@radix-ui/react-icons";
import LivestreamChatMessage from "./LivestreamChatMessage";
import { ScrollArea } from "@/src/shared/components/shadcn-ui/scroll-area";
import { Input } from "@/src/shared/components/shadcn-ui/input";
import { Separator } from "@/src/shared/components/shadcn-ui/seperator";
import { LivestreamMessage } from "@/src/shared/types/message.type";
import { useEffect, useRef, useState } from "react";
import useLivestreamChatSocket from "../../hooks/useLivestreamChatSocket";
import { Button } from "@/src/shared/components/shadcn-ui/button";
import { useAuthStore } from "@/src/shared/libs/zustand/auth.zustand";
import { useParams } from "react-router-dom";

const LivestreamChatCard = () => {
  const endUser = useAuthStore((state) => state.endUser);
  const { id: liveStreamId } = useParams();
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<LivestreamMessage[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { sendMessage } = useLivestreamChatSocket({
    chatUIController: {
      addMessage: (message: LivestreamMessage) =>
        setMessages((prev) => [...prev, message]),
    },
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    sendMessage({
      message: messageInput,
      endUser,
      liveStreamId,
      createdAt: new Date(),
    });

    setMessageInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <Card className="w-96 h-[90vh] bg-gray-800/95 backdrop-blur-sm border-l border-gray-700/50">
      <CardContent className="p-0 flex flex-col h-full">
        <div className="p-4 flex justify-between items-center border-b border-gray-700/50 backdrop-blur-sm">
          <h2 className="font-semibold text-gray-100">Live Chat</h2>
          <button className="flex items-center gap-1 px-2 py-1 text-sm text-gray-400 hover:text-white transition-colors rounded-md hover:bg-gray-700/50">
            Everyone
            <ChevronDownIcon className="h-4 w-4" />
          </button>
        </div>

        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <LivestreamChatMessage
                key={`${message.endUser._id}-${index}`}
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
          </div>
        </ScrollArea>

        <Separator className="bg-gray-700/50" />

        <div className="p-4 pt-3">
          <div className="flex items-center gap-2">
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 bg-gray-700/50 border-gray-600/50 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50"
            />
            <Button
              onClick={handleSendMessage}
              className="p-2.5 bg-blue-500 hover:bg-blue-600 rounded-full text-white shadow-lg transition-all duration-200 hover:shadow-blue-500/25"
              disabled={!messageInput.trim()}
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
