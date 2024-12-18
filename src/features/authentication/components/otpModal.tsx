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
      <DialogContent>
        <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <Button onClick={onSubmit}>Verify</Button>
      </DialogContent>
    </Dialog>
  );
}
