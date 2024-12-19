import { Button } from "@/src/shared/components/shadcn-ui/button";
import {
  Dialog,
  DialogContent,
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
        <div className="flex justify-center items-center">
          <img src={qr} alt="qr" />
        </div>
        <p>Scan the QR code with your authenticator app</p>
        <Button onClick={() => setOtpOpen(true)}>Continue</Button>
      </DialogContent>
    </Dialog>
  );
}
