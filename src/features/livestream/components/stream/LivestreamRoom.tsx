import React, { useEffect, useState } from "react";
import {
  PersonIcon,
  VideoIcon,
  OpenInNewWindowIcon,
  ExitIcon,
  DotsHorizontalIcon,
  DownloadIcon,
  PlusIcon,
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
import AddQuestionDialog from "../stream-question/AddQuestionDialog";
import { QuestionDialog } from "../stream-question/QuestionDialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/shared/components/shadcn-ui/tabs";
import AnsweredQuestionTab from "../stream-question/AnsweredQuestionTab";
import QuestionStatisticTab from "../stream-question/QuestionStatisticTab";

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
    isOpen: isAddQuestionDialogOpen,
    open: openAddQuestionDialog,
    close: closeAddQuestionDialog,
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
    questionStore,
    addQuestion,
    emitQuestionChoice,
  } = useStreamSocket({
    isHost,
  });

  if (!livestream)
    return (
      <div className="flex items-center justify-center h-screen text-xl font-medium">
        Loading...
      </div>
    );
  if (error) {
    console.log("ERROR", error);
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error?.message}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Live indicator */}
        <div className="bg-gradient-to-r from-red-600 to-red-500 text-white text-sm font-medium py-2 px-4 flex items-center shadow-lg">
          <span className="w-2.5 h-2.5 bg-white rounded-full mr-3 animate-pulse"></span>
          <span className="font-semibold tracking-wide">LIVE</span>
          <span className="ml-3 text-sm opacity-90">
            {isRecording ? `Recording ${recordingTime}` : ""}
          </span>
        </div>

        {/* Video feed */}
        <div className="relative flex-1 bg-gray-800 rounded-lg m-2 overflow-hidden shadow-xl">
          <video
            id="streamer"
            className="video-player w-full h-full object-cover"
          />
          <div className="absolute bottom-6 left-6 flex gap-4">
            <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full flex items-center space-x-2">
              <PersonIcon className="h-4 w-4 text-white/90" />
              <span className="text-sm font-medium">
                {livestream.viewers.length}
              </span>
            </div>
            <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-sm font-medium">{livestream.title}</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-900/50 backdrop-blur-sm p-6 flex justify-center items-center space-x-3">
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
          {isHost && (
            <LivestreamControlButton
              icon={<PlusIcon className="h-5 w-5" />}
              active
              onClick={() => {
                openAddQuestionDialog();
              }}
            />
          )}
        </div>
      </div>

      <div className="w-96 border-l border-gray-700">
        <Tabs defaultValue="chat" className="h-screen">
          <TabsList className="bg-gray-800/50 backdrop-blur-sm w-full">
            <TabsTrigger
              value="chat"
              className="text-white data-[state=active]:bg-white/10 data-[state=active]:text-white w-full text-center py-3"
            >
              Chat
            </TabsTrigger>
            <TabsTrigger
              value="question"
              className="text-white data-[state=active]:bg-white/10 data-[state=active]:text-white w-full text-center py-3"
            >
              Question
            </TabsTrigger>
          </TabsList>
          <TabsContent value="chat" className="p-0">
            <LivestreamChatCard />
          </TabsContent>
          <TabsContent value="question" className="p-0">
            {isHost ? <QuestionStatisticTab /> : <AnsweredQuestionTab />}
          </TabsContent>
        </Tabs>
      </div>

      {isHost && (
        <AddQuestionDialog
          isOpen={isAddQuestionDialogOpen}
          close={closeAddQuestionDialog}
          onAddQuestion={(question) => {
            addQuestion(question);
            closeAddQuestionDialog();
          }}
        />
      )}

      {!isHost && questionStore.haveQuestionAvailable() && (
        <QuestionDialog
          open={
            questionStore.questions.length > 0 &&
            !questionStore.questions[questionStore.questions.length - 1]
              .isAnswered
          }
          question={questionStore.questions[questionStore.questions.length - 1]}
          onSelectChoice={(choice) => {
            const question =
              questionStore.questions[questionStore.questions.length - 1];
            console.log("question", question);
            questionStore.answerQuestion(
              questionStore.questions[questionStore.questions.length - 1]._id,
              choice,
            );
            emitQuestionChoice(
              questionStore.questions[questionStore.questions.length - 1]._id,
              choice,
            );
          }}
        />
      )}

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
