import { Button } from "@/src/shared/components/shadcn-ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/components/shadcn-ui/dialog";
import { Dispatch, SetStateAction } from "react";
import { CodeIcon } from "@radix-ui/react-icons";

type props = {
  qr: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setOtpOpen: Dispatch<SetStateAction<boolean>>;
};

export default function QrModal({ qr, open, setOpen, setOtpOpen }: props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] bg-white/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <CodeIcon className="w-6 h-6" />
            Two-Factor Authentication
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-6 py-4">
          <div className="p-4 bg-white rounded-lg shadow-md">
            <img src={qr} alt="qr" className="w-48 h-48" />
          </div>

          <p className="text-center text-gray-600 max-w-sm">
            Please scan this QR code with your preferred authenticator app to
            enable two-factor authentication
          </p>

          <Button
            onClick={() => setOtpOpen(true)}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2"
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
