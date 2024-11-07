import { useAuthStore } from "@/src/shared/libs/zustand/auth.zustand";
import { useSocketStore } from "@/src/shared/libs/zustand/socket-instance.zustand";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import useStreamRecord, { DownloadData } from "./useStreamRecord";
import useScreenShare from "./useScreenShare";
import { SERVER_SOCKET_URL } from "@/src/shared/libs/socketio/client-socket.base";

const ICE_SERVERS = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
};

const MEDIA_CONSTRAINTS = {
  video: {
    width: { min: 640, ideal: 1920, max: 1920 },
    height: { min: 480, ideal: 1080, max: 1080 },
  },
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  },
};

export interface CustomRTCPeerConnection extends RTCPeerConnection {
  pendingCandidates?: RTCIceCandidate[];
}

interface Recording {
  stop: () => void;
  stream: MediaStream;
  mediaRecorder: MediaRecorder;
}

const useStreamSocket = ({ isHost }: { isHost: boolean }) => {
  const navigate = useNavigate();
  const { id: liveStreamId } = useParams();
  const myEndUser = useAuthStore((state) => state.endUser);
  const { socket: clientSocket, setSocket } = useSocketStore();
  const {
    startStreamRecord,
    isRecording,
    downloadData,
    canDownload,
    recordingTime,
  } = useStreamRecord();
  const {
    startScreenShare,
    stopScreenShare,
    isSharingScreen,
    getScreenShareSources,
  } = useScreenShare();

  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionsRef = useRef<{ [key: string]: CustomRTCPeerConnection }>(
    {},
  );
  const [recording, setRecording] = useState<Recording | null>(null);

  const reset = () => {
    console.log("Resetting connections and streams");
    cleanupLocalStream();
    cleanupPeerConnections();
    removeSocketListeners();
  };
  useEffect(() => {
    console.log(
      "clientSocket",
      clientSocket,
      document.getElementById("streamer"),
    );

    if (!clientSocket) {
      return;
    }
    const initializeCall = async () => {
      console.log("initializeCall", isHost);
      reset();
      setupSocketListeners();
      emitInitialRequest();
      console.log("emitInitialRequest");
      if (isHost) await setupLocalStream();
    };

    //wait for ui to load
    setTimeout(() => {
      console.log(
        "clientSocket2",
        clientSocket,
        document.getElementById("streamer"),
      );
      initializeCall();
    }, 1000);

    return reset;
  }, [clientSocket, isHost]);

  const cleanupLocalStream = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
  };

  const cleanupPeerConnections = () => {
    Object.values(peerConnectionsRef.current).forEach((connection) =>
      connection.close(),
    );
    peerConnectionsRef.current = {};
  };

  const removeSocketListeners = () => {
    clientSocket.off("userJoin");
    clientSocket.off("memberLeft");
    clientSocket.off("callMessageFromPeer");
    clientSocket.off("stopLiveStream");
  };

  const setupSocketListeners = () => {
    clientSocket.on("userJoin", handleUserJoin);
    clientSocket.on("memberLeft", handleUserLeft);
    clientSocket.on("callMessageFromPeer", handleMessageFromPeer);
    clientSocket.on("stopLiveStream", handleStopLiveStream);
  };

  const handleUserJoin = ({ fromEndUserId }: { fromEndUserId: string }) => {
    console.log("User joined", fromEndUserId);
    createOffer(fromEndUserId);
  };

  const handleUserLeft = ({ fromEndUserId }: { fromEndUserId: string }) => {
    if (peerConnectionsRef.current[fromEndUserId]) {
      peerConnectionsRef.current[fromEndUserId].close();
      delete peerConnectionsRef.current[fromEndUserId];
    }
  };

  const handleStopLiveStream = ({ liveStreamId }: { liveStreamId: string }) => {
    reset();
    navigate(`/feeds`);
  };

  const handleMessageFromPeer = async ({
    type,
    fromEndUserId,
    data,
  }: {
    type: "offer" | "candidate" | "answer";
    fromEndUserId: string;
    toEndUserId: string;
    data: any;
  }) => {
    console.log("Message from peer type", type);
    switch (type) {
      case "offer":
        await createAnswer(fromEndUserId, data);
        break;
      case "answer":
        await addAnswer(fromEndUserId, data);
        break;
      case "candidate":
        await handleIceCandidate(fromEndUserId, data);
        break;
    }
  };

  const emitInitialRequest = () => {
    clientSocket.emit("endUserConnect", {
      liveStreamId,
      endUserId: myEndUser._id,
    });
  };

  const setupLocalStream = async () => {
    console.log("isHost", isHost);
    try {
      const stream =
        await navigator.mediaDevices.getUserMedia(MEDIA_CONSTRAINTS);
      localStreamRef.current = stream;
      const localVideo = document.getElementById(
        "streamer",
      ) as HTMLVideoElement;
      if (localVideo) localVideo.srcObject = stream;
      localVideo.autoplay = true;
      console.log("localStreamA", stream);
    } catch (error) {
      console.error("Error accessing media devices.", error);
    }
  };

  const createOffer = async (joinerId: string) => {
    await createPeerConnection(joinerId, true);
    const offer = await peerConnectionsRef.current[joinerId]?.createOffer();
    await peerConnectionsRef.current[joinerId]?.setLocalDescription(offer);

    emitCallMessage("offer", joinerId, offer);
  };

  const createPeerConnection = async (
    memberId: string,
    shouldAddTrack: boolean,
  ) => {
    const peerConnection = new RTCPeerConnection(ICE_SERVERS);
    peerConnectionsRef.current[memberId] = peerConnection;
    peerConnectionsRef.current[memberId].pendingCandidates = [];

    if (!isHost) setupRemoteStream(memberId);
    if (isHost) await addLocalStreamTracks(peerConnection);
    setupPeerConnectionListeners(peerConnection, memberId);
  };

  const setupRemoteStream = (memberId: string) => {
    const remoteStream = new MediaStream();
    let remoteVideo = document.getElementById("streamer") as HTMLVideoElement;
    console.log("remoteVideo1", remoteVideo);
    if (!remoteVideo) {
      remoteVideo = document.createElement("video");
      remoteVideo.className = "video-player";
      remoteVideo.id = "streamer";
    }
    remoteVideo.srcObject = remoteStream;
    remoteVideo.autoplay = true;
  };

  const addLocalStreamTracks = async (peerConnection: RTCPeerConnection) => {
    if (!localStreamRef.current) {
      console.log("media get!!!");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      localStreamRef.current = stream;
      const localVideo = document.getElementById(
        "streamer",
      ) as HTMLVideoElement;
      if (localVideo) localVideo.srcObject = stream;

      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });
    } else {
      localStreamRef.current.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStreamRef.current!);
      });
    }
  };

  const setupPeerConnectionListeners = (
    peerConnection: RTCPeerConnection,
    memberId: string,
  ) => {
    if (!isHost) peerConnection.ontrack = handleTrack(memberId);
    peerConnection.onicecandidate = handleIceCandidateEvent(memberId);
    peerConnection.oniceconnectionstatechange =
      handleIceConnectionStateChange(memberId);
  };

  const handleTrack = (memberId: string) => (event: RTCTrackEvent) => {
    const remoteStream = new MediaStream();
    remoteStreamRef.current = remoteStream;
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
    const remoteVideo = document.getElementById("streamer") as HTMLVideoElement;
    console.log("remoteVideo", remoteVideo);
    if (remoteVideo) {
      remoteVideo.srcObject = remoteStream;
      remoteVideo.autoplay = true;
    }
  };

  const handleIceCandidateEvent =
    (memberId: string) => (event: RTCPeerConnectionIceEvent) => {
      if (event.candidate) {
        emitCallMessage("candidate", memberId, event.candidate);
      }
    };

  const handleIceConnectionStateChange = (memberId: string) => () => {
    if (
      peerConnectionsRef.current[memberId].iceConnectionState === "connected"
    ) {
      flushIceCandidates(memberId);
    }
  };

  const createAnswer = async (
    memberId: string,
    offer: RTCSessionDescriptionInit,
  ) => {
    await createPeerConnection(memberId, false);
    await peerConnectionsRef.current[memberId]?.setRemoteDescription(offer);
    const answer = await peerConnectionsRef.current[memberId]?.createAnswer();
    await peerConnectionsRef.current[memberId]?.setLocalDescription(answer);

    emitCallMessage("answer", memberId, answer);
    flushIceCandidates(memberId);
  };

  const addAnswer = async (
    memberId: string,
    answer: RTCSessionDescriptionInit,
  ) => {
    if (!peerConnectionsRef.current[memberId]?.currentRemoteDescription) {
      await peerConnectionsRef.current[memberId]?.setRemoteDescription(answer);
      flushIceCandidates(memberId);
    }
    console.log("addAnswer", memberId);
  };

  const handleIceCandidate = async (
    fromEndUserId: string,
    candidate: RTCIceCandidate,
  ) => {
    const peerConnection = peerConnectionsRef.current[fromEndUserId];
    if (peerConnection) {
      if (!peerConnection.remoteDescription) {
        peerConnection.pendingCandidates?.push(candidate);
        return;
      }
      try {
        await peerConnection.addIceCandidate(candidate);
      } catch (error) {
        console.error("Error adding ICE candidate:", error);
      }
    }
  };

  const flushIceCandidates = async (memberId: string) => {
    const peerConnection = peerConnectionsRef.current[memberId];
    if (peerConnection && peerConnection.pendingCandidates) {
      for (const candidate of peerConnection.pendingCandidates) {
        try {
          await peerConnection.addIceCandidate(candidate);
        } catch (error) {
          console.error("Error adding buffered ICE candidate:", error);
        }
      }
      peerConnection.pendingCandidates = [];
    }
  };

  const emitCallMessage = (type: string, toEndUserId: string, data: any) => {
    clientSocket.emit("callMessageFromPeer", {
      type,
      fromEndUserId: myEndUser._id,
      toEndUserId,
      data,
    });
  };

  const leaveChannel = () => {
    cleanupPeerConnections();
    if (isHost) {
      clientSocket.emit("stopLiveStream", {
        liveStreamId,
        fromEndUserId: myEndUser._id,
      });
    } else {
      clientSocket.emit("memberLeft", {
        liveStreamId,
        fromEndUserId: myEndUser._id,
      });
      navigate(`/feeds`);
    }
  };

  const toggleTrack = (kind: "video" | "audio") => {
    const track = localStreamRef.current
      ?.getTracks()
      .find((t) => t.kind === kind);
    if (track) {
      track.enabled = !track.enabled;
    }
  };

  const toggleCamera = () => toggleTrack("video");
  const toggleMic = () => toggleTrack("audio");

  const startRecording = async () => {
    if (isHost) {
      console.log("startRecording", "localStream", localStreamRef.current);
      if (!localStreamRef.current) return;
      const newRecording = await startStreamRecord(localStreamRef.current);
      setRecording(newRecording);
    } else {
      console.log("startRecording", "remoteStream", remoteStreamRef.current);
      if (!remoteStreamRef.current) return;
      const newRecording = await startStreamRecord(remoteStreamRef.current);
      setRecording(newRecording);
    }
  };
  const stopRecording = () => {
    if (recording) recording.stop();
  };

  // const toggleShareScreenA = async () => {
  //   const newStream = await toggleShareScreen(
  //     Object.values(peerConnectionsRef.current),
  //   );
  //   localStreamRef.current = newStream;
  //   console.log("localStreamC", localStreamRef.current);
  // };
  const startScreenShareModified = async (selectedScreenSourceId: string) => {
    const newStream = await startScreenShare(
      Object.values(peerConnectionsRef.current),
      selectedScreenSourceId,
    );
    localStreamRef.current = newStream;
  };
  const stopScreenShareModified = async () => {
    const newStream = await stopScreenShare(
      Object.values(peerConnectionsRef.current),
    );
    localStreamRef.current = newStream;
  };

  return {
    leaveChannel,
    toggleCamera,
    toggleMic,
    startRecording,
    stopRecording,
    isRecording,
    downloadData,
    canDownload,
    recordingTime,
    startScreenShare: startScreenShareModified,
    stopScreenShare: stopScreenShareModified,
    getScreenShareSources,
    isSharingScreen,
  };
};

export default useStreamSocket;
