import { create } from "zustand";
import { devtools } from "zustand/middleware";
interface AuthStore {
  unreadConversationIds: String[];
  addUnreadConversationId: (unreadConversationId: String) => void;
    removeUnreadConversationId: (unreadConversationId: String) => void;
}

const useUnreadConversationStore = create<AuthStore>()(
  devtools((set) => ({
    unreadConversationIds: [],
    addUnreadConversationId: (unreadConversationId) => set((state) => ({ unreadConversationIds: [...state.unreadConversationIds, unreadConversationId] })),
    removeUnreadConversationId: (unreadConversationId) => set((state) => ({ unreadConversationIds: state.unreadConversationIds.filter((id) => id !== unreadConversationId) })),
  }))
);

export { useUnreadConversationStore };