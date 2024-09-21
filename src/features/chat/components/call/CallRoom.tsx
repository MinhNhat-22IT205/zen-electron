import { SERVER_SOCKET_URL } from "@/src/shared/libs/socketio/client-socket.base";
import { io } from "socket.io-client";
import useCallSocket from "../../hooks/useCallSocket";
import { useLocation } from "react-router-dom";

const clientSocket = io(SERVER_SOCKET_URL);

const CallRoom = () => {
  const location = useLocation();
  const { leaveChannel, toggleCamera, toggleMic } = useCallSocket(clientSocket);
  return (
    //newly initialize page whenever got redirected into
    <div key={location.pathname}>
      <div id="videos">
        <video className="video-player" id="user-1" autoPlay playsInline />
      </div>
      <div id="controls">
        <div
          className="control-container"
          id="camera-btn"
          onClick={toggleCamera}
        >
          Cam
        </div>
        <div className="control-container" id="mic-btn" onClick={toggleMic}>
          Mic
        </div>
        <div
          className="control-container"
          id="leave-btn"
          onClick={leaveChannel}
        >
          Leave
        </div>
      </div>
    </div>
  );
};

export default CallRoom;
