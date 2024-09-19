import { SERVER_SOCKET_URL } from "@/src/shared/libs/socketio/client-socket.base";
import React from "react";
import { useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";

const clientSocket = io(SERVER_SOCKET_URL);

const CallRoom = () => {
  return (
    <div>
      <div id="videos">
        <video className="video-player" id="user-1" autoPlay playsInline />
      </div>
      <div id="controls">
        <div className="control-container" id="camera-btn">
          Cam
        </div>
        <div className="control-container" id="mic-btn">
          Mic
        </div>
      </div>
    </div>
  );
};

export default CallRoom;
