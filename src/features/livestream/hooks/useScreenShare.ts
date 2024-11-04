import React, { useEffect, useState } from "react";
import { CustomRTCPeerConnection } from "./useStreamSocket";

const useScreenShare = () => {
  const [isSharingScreen, setIsSharingScreen] = useState(false);

  const getScreenShareSources = async (): Promise<
    Electron.DesktopCapturerSource[]
  > => {
    try {
      const sources = await window.electron.getSources();
      console.log("Available sources:", sources);
      return sources;
    } catch (error) {
      console.error("Error getting screen share sources:", error);
      return [];
    }
  };

  async function startScreenShare(
    peerConnections: CustomRTCPeerConnection[],
    selectedScreenSourceId: string,
  ) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          // @ts-ignore
          mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: selectedScreenSourceId, // screen share source id
            minWidth: 1280,
            maxWidth: 1280,
            minHeight: 720,
            maxHeight: 720,
          },
        },
      });
      const videoElement = document.getElementById(
        "streamer",
      ) as HTMLVideoElement;
      videoElement.srcObject = stream;
      const screenTrack = stream.getVideoTracks()[0];
      if (screenTrack) {
        console.log("replace camera track with screen track");
        replaceTrack(screenTrack, peerConnections);
      }
      setIsSharingScreen(true);
      return stream;
    } catch (error) {
      console.error("start screen share error = ", error);
    }
  }
  const replaceTrack = (
    newTrack: MediaStreamTrack,
    peerConnections: CustomRTCPeerConnection[],
  ) => {
    console.log("replaceTrack's peerConnections", peerConnections);
    peerConnections.forEach((peerConnection) => {
      const sender = peerConnection.getSenders().forEach((sender) => {
        console.log(sender.track.kind);
        if (sender.track.kind == "video") {
          sender.replaceTrack(newTrack);
        }
      });
    });
  };
  const stopScreenShare = async (
    peerConnections: CustomRTCPeerConnection[],
  ) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      const videoElement = document.getElementById(
        "streamer",
      ) as HTMLVideoElement;
      videoElement.srcObject = stream;
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        console.log("switching back to webcam");
        replaceTrack(videoTrack, peerConnections);
      }
      setIsSharingScreen(false);
      return stream;
    } catch (error) {
      console.error("stop screen share error = ", error);
    }
  };

  return {
    startScreenShare,
    stopScreenShare,
    getScreenShareSources,
    isSharingScreen,
  };
};

export default useScreenShare;
