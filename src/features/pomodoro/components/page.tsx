"use client";

import React, { useState } from "react";
import { EnhancedPomodoroTimer } from "./PomodoroTimer";
import { TodoList } from "./TodoList";
import { SharePopup } from "./SharePopup";
import { YouTubePopup } from "./YoutubePopup";
import { usePomodoroStore } from "@/src/shared/libs/zustand/pomodoro-settings";
import SharePomodoroAsPostDialog from "../../post/components/add-post/SharePomodoroAsPostDialog";

export default function PomodoroPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const {
    totalTimeSpent,
    sessionLength,
    breakLength,
    youtubeVideoId,
    youtubeVideoTitle,
  } = usePomodoroStore();

  const handleShare = () => {
    console.log("Sharing progress...", {
      totalTimeSpent,
      sessionLength,
      breakLength,
      youtubeVideoId,
      youtubeVideoTitle,
    });
    setIsPopupOpen(true);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 relative">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <TodoList />
        <EnhancedPomodoroTimer onShare={handleShare} />
        <YouTubePopup />
        <SharePomodoroAsPostDialog
          isOpen={isPopupOpen}
          onChange={() => setIsPopupOpen(false)}
          close={() => setIsPopupOpen(false)}
        />
      </div>
    </main>
  );
}
