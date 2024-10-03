import { create } from "zustand";
import { EndUser } from "@/src/shared/types/enduser.type";

interface CallRequestDialogState {
  isOpen: boolean;
  caller: EndUser | undefined;
  callingConversationId: string | undefined;
  open: () => void;
  close: () => void;
  setCaller: (caller: EndUser) => void;
  setCallingConversationId: (id: string) => void;
}

export const useCallRequestDialogStore = create<CallRequestDialogState>(
  (set) => ({
    isOpen: false,
    caller: undefined,
    callingConversationId: undefined,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
    setCaller: (caller) => set({ caller }),
    setCallingConversationId: (id) => set({ callingConversationId: id }),
  }),
);
