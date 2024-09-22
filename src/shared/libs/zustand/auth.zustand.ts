import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { EndUser } from "../../types/enduser.type";
interface AuthStore {
  endUser: EndUser;
  setEndUser: (endUser: EndUser) => void;
}

const useAuthStore = create<AuthStore>()(
  devtools((set) => ({
    endUser: {
      _id: "",
      username: "",
      email: "",
      password: "",
      avatar: "",
      description: "",
      createdAt: "",
      updatedAt: "",
    },
    setEndUser: (endUser) => set({ endUser }),
  })),
);

export { useAuthStore };
