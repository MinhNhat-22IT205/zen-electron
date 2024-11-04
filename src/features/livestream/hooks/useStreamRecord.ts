import React, { useState } from "react";
import useRecordingTimer from "./useRecordingTimer";

export type DownloadData = {
  url: string;
  filename: string;
  recordedBlob: Blob;
};

const useStreamRecord = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [canDownload, setCanDownload] = useState<boolean>(false);
  const [downloadData, setDownloadData] = useState<DownloadData | null>(null);

  // Add timer functionality
  const { formattedTime } = useRecordingTimer(isRecording);

  async function startStreamRecord(localStream: MediaStream): Promise<{
    stop: () => void;
    stream: MediaStream;
    mediaRecorder: MediaRecorder;
  }> {
    try {
      // Get user's camera and microphone stream
      console.log("localStreamB", localStream);
      if (!localStream) return;

      // Initialize MediaRecorder with the stream
      const mediaRecorder = new MediaRecorder(localStream, {
        mimeType: "video/webm;codecs=vp8,opus",
      });

      // Array to store chunks of recorded data
      const recordedChunks: Blob[] = [];

      // Handle data available event
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.push(event.data);
        }
      };

      // Handle recording stop event
      mediaRecorder.onstop = () => {
        // Combine chunks into a single Blob
        const recordedBlob = new Blob(recordedChunks, {
          type: "video/webm",
        });

        // Create download link
        const downloadLink = URL.createObjectURL(recordedBlob);
        const filename = `recording-${Date.now()}.webm`;
        setDownloadData({ url: downloadLink, filename, recordedBlob });
        console.log("recordedBlob", downloadLink);
        setIsRecording(false);
        setCanDownload(true);
      };

      // Start recording
      mediaRecorder.start();
      setIsRecording(true);

      // Return controls for stopping the recording
      return {
        stop: () => {
          mediaRecorder.stop();
        },
        stream: localStream,
        mediaRecorder: mediaRecorder,
      };
    } catch (error) {
      console.error("Error starting recording:", error);
      throw error;
    }
  }
  return {
    startStreamRecord,
    isRecording,
    downloadData,
    canDownload,
    recordingTime: formattedTime, // Export the formatted time
  };
};

export default useStreamRecord;
