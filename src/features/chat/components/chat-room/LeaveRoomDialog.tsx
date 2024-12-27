import { Button } from "@/src/shared/components/shadcn-ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/src/shared/components/shadcn-ui/dialog";
import { DropdownMenuItem } from "@/src/shared/components/shadcn-ui/dropdown";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthStore } from "@/src/shared/libs/zustand/auth.zustand";
import http from "@/src/shared/libs/axios/axios.base";
import { useConversationActiveStore } from "@/src/shared/libs/zustand/conversation-active.zustand";
import { ExitIcon } from "@radix-ui/react-icons";

type LeaveRoomDialogProps = {
  onLeave: () => void;
};

const LeaveRoomDialog = ({ onLeave }: LeaveRoomDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { conversationId } = useParams();
  const endUser = useAuthStore((state) => state.endUser);
  const stateConversationActive = useConversationActiveStore((state) => state);

  const handleLeave = async () => {
    try {
      setIsLoading(true);
      const conversation = await http.patch(
        `/conversation/${conversationId}/leave`,
        {
          conversationId,
        },
      );
      stateConversationActive.setConversations({
        ...stateConversationActive.conversations,
        [conversationId]: conversation.data.encryptionKey,
      });
      onLeave();
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to leave conversation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            setIsOpen(true);
          }}
          className="text-red-500 hover:text-red-600 focus:text-red-600 flex items-center gap-2"
        >
          <ExitIcon className="h-4 w-4" />
          Leave Room
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white/95 backdrop-blur-sm border border-red-100">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-red-500 flex items-center gap-2">
            <ExitIcon className="h-5 w-5" />
            Leave Room
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            Are you sure you want to leave this chat room? You will no longer
            receive messages from this conversation.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6 gap-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
            className="border-red-200 hover:bg-red-50 text-gray-700"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleLeave}
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-600 text-white transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                Leaving...
              </div>
            ) : (
              "Leave Room"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveRoomDialog;
