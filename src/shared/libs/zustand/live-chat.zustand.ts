import { create } from "zustand";
import { LivestreamMessage } from "@/src/shared/types/message.type";

interface LiveChatState {
  messages: LivestreamMessage[];
  addMessage: (message: LivestreamMessage) => void;
  clearMessages: () => void;
}

export const useLiveChatStore = create<LiveChatState>((set) => ({
  messages: [],

  addMessage: (message: LivestreamMessage) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  clearMessages: () => {
    set({ messages: [] });
  },
}));
