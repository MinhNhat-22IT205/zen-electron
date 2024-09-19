import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/shared/components/shadcn-ui/avatar";
import { Button } from "@/src/shared/components/shadcn-ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/shared/components/shadcn-ui/dialog";
import { EndUser } from "@/src/shared/types/enduser.type";
import React from "react";
import { useNavigate } from "react-router-dom";

type CallRequestDialogProps = {
  isOpen: boolean;
  onChange: (isOpen: boolean) => void;
  acceptCall: () => void;
  denyCall: () => void;
  sender: EndUser;
  callingConversationId: string;
};
const CallRequestDialog = ({
  isOpen,
  onChange,
  acceptCall,
  denyCall,
  sender,
  callingConversationId,
}: CallRequestDialogProps) => {
  const navigate = useNavigate();
  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{sender?.username} wants to call you</DialogTitle>
        </DialogHeader>
        <Avatar>
          <AvatarImage src={sender?.avatar} alt="User Avatar" />
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>
        <DialogFooter>
          <Button
            variant="default"
            className="bg-green-300 text-white"
            onClick={() => {
              acceptCall();
              navigate(
                `/call-room?conversationId=${callingConversationId}&isSender=false`,
              );
            }}
          >
            Accept
          </Button>
          <Button variant="destructive" onClick={denyCall}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CallRequestDialog;
