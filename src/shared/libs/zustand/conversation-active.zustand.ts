import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { EndUser } from "../../types/enduser.type";
interface ConversationActiveStore {
  conversations: Record<string, string>; // HashMap where key is conversationId and value is encryptionKey
  setConversations: (conversations: Record<string, string>) => void;
}

const useConversationActiveStore = create<ConversationActiveStore>()(
  devtools((set) => ({
    conversations: {},
    setConversations: (conversations) => set({ conversations }),
  })),
);

export { useConversationActiveStore };
