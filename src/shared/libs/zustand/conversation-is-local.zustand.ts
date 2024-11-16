import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface ConversationIsLocalStore {
  conversationIsLocal: Record<string, boolean>;
  setConversationIsLocal: (
    conversationIsLocal: Record<string, boolean>,
  ) => void;
}

const useConversationIsLocalStore = create<ConversationIsLocalStore>()(
  devtools((set) => ({
    conversationIsLocal: {},
    setConversationIsLocal: (conversationIsLocal) =>
      set({ conversationIsLocal }),
  })),
);

export { useConversationIsLocalStore };
