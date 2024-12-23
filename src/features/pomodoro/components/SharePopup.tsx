import React from "react";
import { Button } from "@/src/shared/components/shadcn-ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/components/shadcn-ui/dialog";

interface SharePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: () => void;
}

export const SharePopup: React.FC<SharePopupProps> = ({
  isOpen,
  onClose,
  onShare,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Time's Up!</DialogTitle>
          <DialogDescription>
            Would you like to share your progress?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onShare}>Share Progress</Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
