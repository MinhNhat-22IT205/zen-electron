import { Button } from "@/src/shared/components/shadcn-ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/shared/components/shadcn-ui/dialog";
import { Dispatch, SetStateAction } from "react";

type props = {
  qr: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setOtpOpen: Dispatch<SetStateAction<boolean>>;
};

export default function QrModal({ qr, open, setOpen, setOtpOpen }: props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <img src={qr} alt="qr" />
        <p>Scan the QR code with your authenticator app</p>
        <Button onClick={() => setOtpOpen(true)}>Continue</Button>
      </DialogContent>
    </Dialog>
  );
}
