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

type LeaveRoomDialogProps = {
  onLeave: () => void;
};

const LeaveRoomDialog = ({ onLeave }: LeaveRoomDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { conversationId } = useParams();
  const endUser = useAuthStore((state) => state.endUser);
  const conversations = useConversationActiveStore(
    (state) => state.conversations,
  );

  const handleLeave = async () => {
    try {
      setIsLoading(true);
      await http.patch(`/conversation/${conversationId}/leave`, {
        conversationId,
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
        >
          Leave Room
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Leave Room</DialogTitle>
          <DialogDescription>
            Are you sure you want to leave this chat room? You will no longer
            receive messages from this conversation.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleLeave}
            disabled={isLoading}
          >
            {isLoading ? "Leaving..." : "Leave"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveRoomDialog;
