import { SERVER_SOCKET_URL } from "@/src/shared/libs/socketio/client-socket.base";
import { io } from "socket.io-client";
import useCallSocket from "../../hooks/useCallSocket";
import { useLocation } from "react-router-dom";
import {
  CameraIcon,
  ExitIcon,
  SpeakerModerateIcon,
} from "@radix-ui/react-icons";

const CallRoom = () => {
  const location = useLocation();
  const { leaveChannel, toggleCamera, toggleMic } = useCallSocket();
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
          <CameraIcon className="w-4 h-4" />
        </div>
        <div className="control-container" id="mic-btn" onClick={toggleMic}>
          <SpeakerModerateIcon className="w-4 h-4" />
        </div>
        <div
          className="control-container"
          id="leave-btn"
          onClick={leaveChannel}
        >
          <ExitIcon className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default CallRoom;
