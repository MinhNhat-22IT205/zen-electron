import React, { useEffect, useState } from "react";
import {
  PersonIcon,
  VideoIcon,
  OpenInNewWindowIcon,
  ExitIcon,
  DotsHorizontalIcon,
  DownloadIcon,
} from "@radix-ui/react-icons";
import LivestreamControlButton from "./LivestreamControlButton";
import LivestreamChatCard from "../chat/LivestreamChatCard";
import useStreamSocket from "../../hooks/useStreamSocket";
import { io } from "socket.io-client";
import { SERVER_SOCKET_URL } from "@/src/shared/libs/socketio/client-socket.base";
import { useSocketStore } from "@/src/shared/libs/zustand/socket-instance.zustand";
import useSWR from "swr";
import { Livestream } from "@/src/shared/types/livestream.type";
import { fetcher } from "@/src/shared/libs/swr/fetcher";
import { useParams } from "react-router-dom";
import { LIVESTREAM_API_ENDPOINT } from "../../api/livestream-endpoint.api";
import { useAuthStore } from "@/src/shared/libs/zustand/auth.zustand";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/shared/components/shadcn-ui/dropdown";
import { useDisclosure } from "@/src/shared/hooks/use-disclosure";
import ScreenShareListDialog from "@/src/shared/components/ScreenShareListDialog";
import AddPostAfterRecordingDialog from "../AddPostAfterRecordingDialog";
const clientSocket = io(SERVER_SOCKET_URL + "/livestream");
const LivestreamRoom = () => {
  const { id } = useParams();
  const myEndUser = useAuthStore((state) => state.endUser);
  const { setSocket } = useSocketStore();
  const {
    isOpen: isShareDialogOpen,
    open: openShareDialog,
    close: closeShareDialog,
  } = useDisclosure();
  const {
    isOpen: isPostDialogOpen,
    open: openPostDialog,
    close: closePostDialog,
  } = useDisclosure();
  useDisclosure();
  const [screenShareSources, setScreenShareSources] = useState<
    Electron.DesktopCapturerSource[]
  >([]);

  useEffect(() => {
    setSocket(clientSocket);
  }, []);

  const [mediaStatus, setMediaStatus] = useState<{
    camera: boolean;
    mic: boolean;
  }>({ camera: true, mic: true });
  const toggleMediaStatus = (key: "camera" | "mic") => {
    setMediaStatus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const { data: livestream, error } = useSWR<Livestream>(
    `${LIVESTREAM_API_ENDPOINT}/${id}`,
    fetcher,
    { refreshInterval: 2000 },
  );
  const isHost = livestream?.endUserId === myEndUser._id;
  const {
    leaveChannel,
    toggleCamera,
    toggleMic,
    startRecording,
    stopRecording,
    isRecording,
    downloadData,
    canDownload,
    recordingTime,
    isSharingScreen,
    startScreenShare,
    stopScreenShare,
    getScreenShareSources,
  } = useStreamSocket({
    isHost,
  });

  if (!livestream) return <div>Loading...</div>;
  if (error) {
    console.log("ERROR", error);
    return <div>{error?.message}</div>;
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Live indicator */}
        <div className="bg-red-600 text-white text-xs font-semibold py-1 px-3 flex items-center">
          <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
          LIVE
          <span className="text-xs ml-2">
            {isRecording ? `Recording ${recordingTime}` : ""}
          </span>
        </div>

        {/* Video feed */}
        <div className="relative flex-1 bg-gray-800">
          <video id="streamer" className="video-player w-full h-full " />
          <div className="absolute bottom-4 left-4 bg-gray-900 bg-opacity-50 px-2 py-1 rounded-md flex items-center space-x-2">
            <PersonIcon className="h-4 w-4" />
            <span className="text-sm">{livestream.viewers.length}</span>
          </div>
          <div className="absolute bottom-4 left-20 bg-gray-900 bg-opacity-50 px-2 py-1 rounded-md">
            <span className="text-sm">{livestream.title}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-900 p-4 flex justify-center items-center space-x-2">
          {isHost && (
            <>
              <LivestreamControlButton
                id="camera-btn"
                icon={<VideoIcon className="h-5 w-5" />}
                active={mediaStatus.camera}
                onClick={() => {
                  toggleCamera();
                  toggleMediaStatus("camera");
                }}
              />
              <LivestreamControlButton
                id="mic-btn"
                icon={<VideoIcon className="h-5 w-5" />}
                active={mediaStatus.mic}
                onClick={() => {
                  toggleMic();
                  toggleMediaStatus("mic");
                }}
              />
              <LivestreamControlButton
                id="share-btn"
                icon={<OpenInNewWindowIcon className="h-5 w-5" />}
                active={isSharingScreen}
                onClick={() => {
                  if (isSharingScreen) {
                    stopScreenShare();
                  } else {
                    getScreenShareSources().then((sources) => {
                      setScreenShareSources(sources);
                      openShareDialog();
                    });
                  }
                }}
              />
            </>
          )}
          <LivestreamControlButton
            id="end-btn"
            icon={<ExitIcon className="h-5 w-5" />}
            active
            onClick={() => {
              leaveChannel();
            }}
          />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <LivestreamControlButton
                icon={<DotsHorizontalIcon className="h-5 w-5" />}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => {
                  console.log("isRecording", isRecording);
                  isRecording ? stopRecording() : startRecording();
                }}
              >
                {isRecording ? "Stop recording" : "Record the livestream"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {canDownload && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <LivestreamControlButton
                    icon={<DownloadIcon className="h-5 w-5" />}
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => {
                      if (downloadData) {
                        const link = document.createElement("a");
                        link.href = downloadData.url;
                        link.download = downloadData.filename;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }
                    }}
                  >
                    Download the recording
                  </DropdownMenuItem>
                  <AddPostAfterRecordingDialog videoData={downloadData} />
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>

      <LivestreamChatCard />

      <ScreenShareListDialog
        isOpen={isShareDialogOpen}
        onClose={closeShareDialog}
        sources={screenShareSources}
        onSourceSelect={(source) => {
          startScreenShare(source.id);
          closeShareDialog();
        }}
      />
    </div>
  );
};

export default LivestreamRoom;
