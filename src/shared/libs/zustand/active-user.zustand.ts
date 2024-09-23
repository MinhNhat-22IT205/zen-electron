import { create } from "zustand";
import { devtools } from "zustand/middleware";
interface Store {
  activeUserIds: String[];
  addActiveUserId: (activeUserId: String) => void;
  removeActiveUserId: (activeUserId: String) => void;
  setActiveUserIds: (activeUserIds: String[]) => void;
}

const useActiveUserIdStore = create<Store>()(
  devtools((set) => ({
    activeUserIds: [],
    addActiveUserId: (activeUserId) =>
      set((state) => ({
        activeUserIds: [...state.activeUserIds, activeUserId],
      })),
    removeActiveUserId: (activeUserId) =>
      set((state) => ({
        activeUserIds: state.activeUserIds.filter((id) => id !== activeUserId),
      })),
    setActiveUserIds: (activeUserIds) =>
      set((state) => ({
        activeUserIds: activeUserIds,
      })),
  })),
);

export { useActiveUserIdStore };
