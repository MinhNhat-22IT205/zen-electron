import { create } from "zustand";

interface PomodoroSettings {
  totalTimeSpent: number;
  sessionLength: number;
  breakLength: number;
  youtubeVideoId: string;
  youtubeVideoTitle: string;
  isActive: boolean;
  isSession: boolean;
  timeLeft: number;

  // Actions
  setTotalTimeSpent: (time: number) => void;
  setSessionLength: (length: number) => void;
  setBreakLength: (length: number) => void;
  setYoutubeVideoId: (id: string) => void;
  setYoutubeVideoTitle: (title: string) => void;
  setIsActive: (active: boolean) => void;
  setIsSession: (isSession: boolean) => void;
  setTimeLeft: (time: number) => void;
  setPomodoroSettings: (settings: Partial<PomodoroSettings>) => void;
  resetSettings: () => void;
}

export const usePomodoroStore = create<PomodoroSettings>()((set) => ({
  totalTimeSpent: 0,
  sessionLength: 15,
  breakLength: 2,
  youtubeVideoId: "",
  youtubeVideoTitle: "",
  isActive: false,
  isSession: true,
  timeLeft: 15 * 60,

  setTotalTimeSpent: (time) => set({ totalTimeSpent: time }),
  setSessionLength: (length) => set({ sessionLength: length }),
  setBreakLength: (length) => set({ breakLength: length }),
  setYoutubeVideoId: (id) => set({ youtubeVideoId: id }),
  setYoutubeVideoTitle: (title) => set({ youtubeVideoTitle: title }),
  setIsActive: (active) => set({ isActive: active }),
  setIsSession: (isSession) => set({ isSession: isSession }),
  setTimeLeft: (time) => set({ timeLeft: time }),
  setPomodoroSettings: (settings) => set(settings),
  resetSettings: () =>
    set((state) => ({
      totalTimeSpent: 0,
      isActive: false,
      isSession: true,
      timeLeft: state.sessionLength * 60,
    })),
}));
