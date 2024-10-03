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
import { IMAGE_BASE_URL } from "@/src/shared/constants/base-paths";
import { EndUser } from "@/src/shared/types/enduser.type";
import React from "react";
import { useNavigate } from "react-router-dom";

type CallRequestDialogProps = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  denyCall: () => void;
  caller: EndUser;
  callingConversationId: string;
};
const CallRequestDialog = ({
  isOpen,
  open,
  close,
  denyCall,
  caller,
  callingConversationId,
}: CallRequestDialogProps) => {
  const navigate = useNavigate();
  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{caller?.username} wants to call you</DialogTitle>
        </DialogHeader>
        <Avatar>
          <AvatarImage
            src={IMAGE_BASE_URL + caller?.avatar}
            alt="User Avatar"
          />
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>
        <DialogFooter>
          <Button
            variant="default"
            className="bg-green-300 text-white"
            onClick={() => {
              close();
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
