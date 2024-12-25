import { Button } from "@/src/shared/components/shadcn-ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/shared/components/shadcn-ui/dialog";
import {
  InputOTP,
  InputOTPSlot,
  InputOTPGroup,
} from "@/src/shared/components/shadcn-ui/input-otp";
import { useState, Dispatch, SetStateAction } from "react";
import { CodeIcon } from "@radix-ui/react-icons";

type props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setOtp: Dispatch<SetStateAction<string>>;
  onSubmit: () => void;
  otp: string;
};

export default function OtpModal({
  open,
  setOpen,
  setOtp,
  onSubmit,
  otp,
}: props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] bg-white/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <CodeIcon className="w-6 h-6" />
            Verify Authentication
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600 mt-2">
            Enter the 6-digit code from your authenticator app to verify your
            identity
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-8 py-6">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
            className="gap-2"
          >
            <InputOTPGroup>
              <InputOTPSlot
                index={0}
                className="border-amber-200 focus:border-amber-400"
              />
              <InputOTPSlot
                index={1}
                className="border-amber-200 focus:border-amber-400"
              />
              <InputOTPSlot
                index={2}
                className="border-amber-200 focus:border-amber-400"
              />
              <InputOTPSlot
                index={3}
                className="border-amber-200 focus:border-amber-400"
              />
              <InputOTPSlot
                index={4}
                className="border-amber-200 focus:border-amber-400"
              />
              <InputOTPSlot
                index={5}
                className="border-amber-200 focus:border-amber-400"
              />
            </InputOTPGroup>
          </InputOTP>

          <Button
            onClick={onSubmit}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2"
          >
            Verify Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
