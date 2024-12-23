import { useToast } from "@/src/shared/hooks/use-toast";
import { useAuthStore } from "@/src/shared/libs/zustand/auth.zustand";
import { useSocketStore } from "@/src/shared/libs/zustand/socket-instance.zustand";
import { EndUser } from "@/src/shared/types/enduser.type";
import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Socket } from "socket.io-client";

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
  audio: true,
};

interface CustomRTCPeerConnection extends RTCPeerConnection {
  pendingCandidates?: RTCIceCandidate[];
}

const useCallSocket = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get("conversationId");
  const isSender = searchParams.get("isSender") === "true";
  const myEndUser = useAuthStore((state) => state.endUser);
  const { socket: clientSocket } = useSocketStore();

  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionsRef = useRef<{ [key: string]: CustomRTCPeerConnection }>(
    {},
  );

  const reset = () => {
    console.log("Resetting connections and streams");
    cleanupLocalStream();
    cleanupPeerConnections();
    removeRemoteVideos();
    removeSocketListeners();
  };
  useEffect(() => {
    if (!clientSocket) return;

    const initializeCall = async () => {
      reset();
      setupSocketListeners();
      emitInitialRequest();
      await setupLocalStream();
    };

    initializeCall();

    return reset;
  }, []);

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

  const removeRemoteVideos = () => {
    const videoContainer = document.getElementById("videos");
    if (videoContainer) {
      Array.from(videoContainer.children).forEach((child) => {
        if (child.id !== "user-1") {
          videoContainer.removeChild(child);
        }
      });
    }
  };

  const removeSocketListeners = () => {
    clientSocket.off("requestDeny");
    clientSocket.off("requestAccept");
    clientSocket.off("memberLeft");
    clientSocket.off("callMessageFromPeer");
  };

  const setupSocketListeners = () => {
    clientSocket.on("requestDeny", handleRequestDenied);
    clientSocket.on("requestAccept", handleRequestAccepted);
    clientSocket.on("memberLeft", handleUserLeft);
    clientSocket.on("callMessageFromPeer", handleMessageFromPeer);
  };

  const handleRequestDenied = ({ fromEndUser }: { fromEndUser: EndUser }) => {
    toast({
      title: "Call denied",
      description: `The call was denied by ${fromEndUser.username}`,
    });

    // reset();
    // navigate(`/conversations/${conversationId}`);
  };

  const handleRequestAccepted = ({
    endUserId: joinerId,
  }: {
    endUserId: string;
  }) => {
    console.log("Request accepted", joinerId);
    createOffer(joinerId);
  };

  const handleUserLeft = ({ fromEndUserId }: { fromEndUserId: string }) => {
    const remoteVideo = document.getElementById(fromEndUserId);
    if (remoteVideo) remoteVideo.style.display = "none";
    if (peerConnectionsRef.current[fromEndUserId]) {
      peerConnectionsRef.current[fromEndUserId].close();
      delete peerConnectionsRef.current[fromEndUserId];
    }
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
    const requestType = isSender ? "requestCall" : "requestAccept";
    clientSocket.emit(requestType, {
      conversationId,
      endUserId: myEndUser._id,
    });
  };

  const setupLocalStream = async () => {
    try {
      localStreamRef.current =
        await navigator.mediaDevices.getUserMedia(MEDIA_CONSTRAINTS);
      const localVideo = document.getElementById("user-1") as HTMLVideoElement;
      if (localVideo) localVideo.srcObject = localStreamRef.current;
      console.log("localStream", localStreamRef.current);
    } catch (error) {
      console.error("Error accessing media devices.", error);
    }
  };

  const createOffer = async (joinerId: string) => {
    await createPeerConnection(joinerId);
    const offer = await peerConnectionsRef.current[joinerId]?.createOffer();
    await peerConnectionsRef.current[joinerId]?.setLocalDescription(offer);

    emitCallMessage("offer", joinerId, offer);
  };

  const createPeerConnection = async (memberId: string) => {
    const peerConnection = new RTCPeerConnection(ICE_SERVERS);
    peerConnectionsRef.current[memberId] = peerConnection;
    peerConnectionsRef.current[memberId].pendingCandidates = [];

    setupRemoteStream(memberId);
    await addLocalStreamTracks(peerConnection);
    setupPeerConnectionListeners(peerConnection, memberId);
  };

  const setupRemoteStream = (memberId: string) => {
    const remoteStream = new MediaStream();
    const remoteVideo = document.createElement("video");
    remoteVideo.srcObject = remoteStream;
    remoteVideo.autoplay = true;
    remoteVideo.classList.add("video-player");
    remoteVideo.style.display = "block";
    remoteVideo.id = memberId;
    document.getElementById("videos")?.append(remoteVideo);
    document.getElementById("user-1")?.classList.add("smallFrame");
  };

  const addLocalStreamTracks = async (peerConnection: RTCPeerConnection) => {
    if (!localStreamRef.current) {
      localStreamRef.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      const localVideo = document.getElementById("user-1") as HTMLVideoElement;
      if (localVideo) localVideo.srcObject = localStreamRef.current;
    }
    localStreamRef.current?.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStreamRef.current!);
    });
  };

  const setupPeerConnectionListeners = (
    peerConnection: RTCPeerConnection,
    memberId: string,
  ) => {
    peerConnection.ontrack = handleTrack(memberId);
    peerConnection.onicecandidate = handleIceCandidateEvent(memberId);
    peerConnection.oniceconnectionstatechange =
      handleIceConnectionStateChange(memberId);
  };

  const handleTrack = (memberId: string) => (event: RTCTrackEvent) => {
    const remoteStream = new MediaStream();
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
    const remoteVideo = document.getElementById(memberId) as HTMLVideoElement;
    if (remoteVideo) remoteVideo.srcObject = remoteStream;
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
    await createPeerConnection(memberId);
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
    clientSocket.emit("memberLeft", {
      conversationId,
      fromEndUserId: myEndUser._id,
    });
    navigate(`/conversations/${conversationId}`);
  };

  const toggleTrack = (kind: "video" | "audio") => {
    const track = localStreamRef.current
      ?.getTracks()
      .find((t) => t.kind === kind);
    if (track) {
      track.enabled = !track.enabled;
      const btnId = kind === "video" ? "camera-btn" : "mic-btn";
      const btn = document.getElementById(btnId);
      if (btn) {
        btn.style.backgroundColor = track.enabled
          ? "#f3f4f6"
          : "rgb(255, 80, 80)";
      }
    }
  };

  const toggleCamera = () => toggleTrack("video");
  const toggleMic = () => toggleTrack("audio");

  return { leaveChannel, toggleCamera, toggleMic };
};

export default useCallSocket;
