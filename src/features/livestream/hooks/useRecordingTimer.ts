import { useState, useEffect, useRef } from "react";

const useRecordingTimer = (isRecording: boolean) => {
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRecording) {
      // Start the timer when recording begins
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      // Clear timer and reset when recording stops
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setElapsedTime(0);
    }

    // Cleanup on unmount or when recording state changes
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  // Format seconds into HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const pad = (num: number): string => num.toString().padStart(2, "0");

    return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
  };

  return {
    elapsedTime,
    formattedTime: formatTime(elapsedTime),
  };
};

export default useRecordingTimer;
