import { useAuthStore } from "@/src/shared/libs/zustand/auth.zustand";
import React, { useEffect } from "react";
import { set } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Socket } from "socket.io-client";

const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
};

let localStream: MediaStream | null = null;

let peerConnections: { [key: string]: RTCPeerConnection } = {};

const useCallSocket = (clientSocket: Socket) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get("conversationId");
  const isSenderString = searchParams.get("isSender");
  const isSender = isSenderString === "true";
  const myEndUser = useAuthStore((state) => state.endUser);

  const media_constraints = {
    video: {
      width: { min: 640, ideal: 1920, max: 1920 },
      height: { min: 480, ideal: 1080, max: 1080 },
    },
    audio: true,
  };
  // const addPeerConnection = (
  //   memberId: string,
  //   peerConnection: RTCPeerConnection,
  // ) => {
  //   setPeerConnections((prev) => ({
  //     ...prev,
  //     [memberId]: peerConnection,
  //   }));
  // };
  // const removePeerConnection = (memberId: string) => {
  //   const { [memberId]: _, ...rest } = peerConnections;
  //   setPeerConnections(rest);
  // };
  useEffect(() => {
    (async () => {
      clientSocket.on("connect", () => {
        clientSocket.emit("endUserConnect", { endUserId: myEndUser._id });

        console.log("Connected ");
      });

      clientSocket.on("connect_error", (err) => {
        console.error("Connection error: ", err);
      });

      clientSocket.on("disconnect", () => {
        console.log("Disconnected");
      });

      const handleUserJoined = (data: any) => {
        console.log("User Joined", data);
      };
      const handleUserLeft = ({ fromEndUserId }: { fromEndUserId: string }) => {
        document.getElementById(fromEndUserId).style.display = "none";
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
        if (type === "offer") {
          //data:offer
          createAnswer(fromEndUserId, data);
        }
        if (type === "answer") {
          //data:answer
          addAnswer(fromEndUserId, data);
        }

        if (type === "candidate") {
          if (peerConnections[fromEndUserId]) {
            if (!peerConnections[fromEndUserId].remoteDescription) {
              console.warn(
                "Remote description not set, cannot add ICE candidate, remoteuser:",
                fromEndUserId,
              );
              return;
            }
            try {
              await peerConnections[fromEndUserId].addIceCandidate(
                data as RTCIceCandidate,
              );
            } catch (error) {
              console.error("Error adding ICE candidate:", error);
            }
          }
        }
      };

      const handleRequestAccepted = ({
        endUserId: joinerId,
      }: {
        endUserId: string;
      }) => {
        console.log("Request accepted", joinerId);
        createOffer(joinerId);
      };

      const handleRequestDenied = (data: any) => {
        navigate("/conversations");
      };
      clientSocket.on("requestDeny", handleRequestDenied);

      // when user joined
      clientSocket.on("requestAccept", handleRequestAccepted);

      clientSocket.on("memberLeft", handleUserLeft);

      clientSocket.on("callMessageFromPeer", handleMessageFromPeer);

      if (isSender) {
        clientSocket.emit("requestCall", {
          conversationId,
          endUserId: myEndUser._id,
        });
      } else {
        clientSocket.emit("requestAccept", {
          conversationId: conversationId,
          endUserId: myEndUser._id,
        });
      }
      localStream =
        await navigator.mediaDevices.getUserMedia(media_constraints);
      (document.getElementById("user-1") as HTMLVideoElement).srcObject =
        localStream;
    })();

    return () => {
      localStream = null;
      Object.keys(peerConnections).forEach((memberId) => {
        peerConnections[memberId].close();
      });
      peerConnections = {};
    };
  }, []);

  const createOffer = async (joinerId: string) => {
    await createPeerConnection(joinerId);

    console.log("Peer connection", peerConnections[joinerId], peerConnections);
    let offer = await peerConnections[joinerId]?.createOffer();
    await peerConnections[joinerId]?.setLocalDescription(offer);

    clientSocket.emit("callMessageFromPeer", {
      type: "offer",
      fromEndUserId: myEndUser._id,
      toEndUserId: joinerId,
      data: offer,
    });
    console.log("Offer sent to", joinerId);
  };

  const createPeerConnection = async (memberId: string) => {
    const peerConnection = new RTCPeerConnection(servers);
    peerConnections[memberId] = peerConnection;

    const remoteStream = new MediaStream();
    const remoteVideo = document.createElement("video");
    remoteVideo.srcObject = remoteStream;
    remoteVideo.autoplay = true;
    remoteVideo.classList.add("video-player");
    remoteVideo.style.display = "block";
    remoteVideo.setAttribute("id", memberId);
    document.getElementById("videos").append(remoteVideo);

    document.getElementById("user-1").classList.add("smallFrame");
    console.log("Local stream", localStream);
    if (!localStream) {
      localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      (document.getElementById("user-1") as HTMLVideoElement).srcObject =
        localStream;
    }
    localStream?.getTracks().forEach((track) => {
      console.log(`Adding track: ${track.kind}`);
      peerConnection.addTrack(track, localStream);
    });

    peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        if (track.kind === "audio") {
          console.log("Audio track received");
        } else if (track.kind === "video") {
          console.log("Video track received");
        }
        remoteStream.addTrack(track);
      });
    };

    peerConnection.onicecandidate = async (event) => {
      if (event.candidate) {
        clientSocket.emit("callMessageFromPeer", {
          type: "candidate",
          fromEndUserId: myEndUser._id,
          toEndUserId: memberId,
          data: event.candidate,
        });
      }
    };
  };

  const createAnswer = async (memberId: string, offer: any) => {
    await createPeerConnection(memberId);

    await peerConnections[memberId]?.setRemoteDescription(offer);
    console.log("Remote description set for", memberId);

    console.log("second localDes");
    let answer = await peerConnections[memberId]?.createAnswer();
    await peerConnections[memberId]?.setLocalDescription(answer);

    clientSocket.emit("callMessageFromPeer", {
      type: "answer",
      fromEndUserId: myEndUser._id,
      toEndUserId: memberId,
      data: answer,
    });
    console.log("Answer sent to", memberId);
  };

  const addAnswer = async (memberId: string, answer: any) => {
    if (!peerConnections[memberId]?.currentRemoteDescription) {
      peerConnections[memberId]?.setRemoteDescription(answer);
      console.log("Addanswer: Remote description added for", memberId);
    }
  };

  const leaveChannel = async () => {
    localStream.getTracks().forEach((track) => {
      track.stop();
    });
    Object.keys(peerConnections).forEach((memberId) => {
      peerConnections[memberId].close();
    });
    clientSocket.emit("memberLeft", {
      conversationId,
      fromEndUserId: myEndUser._id,
    });
    navigate("/conversations");
  };

  const toggleCamera = async () => {
    const videoTrack = localStream
      .getTracks()
      .find((track) => track.kind === "video");

    if (videoTrack.enabled) {
      videoTrack.enabled = false;
      document.getElementById("camera-btn").style.backgroundColor =
        "rgb(255, 80, 80)";
    } else {
      videoTrack.enabled = true;
      document.getElementById("camera-btn").style.backgroundColor =
        "rgb(179, 102, 249, .9)";
    }
  };

  const toggleMic = async () => {
    const audioTrack = localStream
      .getTracks()
      .find((track) => track.kind === "audio");

    if (audioTrack.enabled) {
      audioTrack.enabled = false;
      document.getElementById("mic-btn").style.backgroundColor =
        "rgb(255, 80, 80)";
    } else {
      audioTrack.enabled = true;
      document.getElementById("mic-btn").style.backgroundColor =
        "rgb(179, 102, 249, .9)";
    }
  };

  return { leaveChannel, toggleCamera, toggleMic };
};

export default useCallSocket;
