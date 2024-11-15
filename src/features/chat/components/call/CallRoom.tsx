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
    <div key={location.pathname} className="w-screen h-screen relative">
      <div
        id="videos"
        className="grid w-full h-full gap-1 overflow-hidden grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] grid-rows-auto"
      >
        <video
          className="video-player bg-black w-full h-full object-cover"
          id="user-1"
          autoPlay
          playsInline
        />
      </div>

      <div
        id="controls"
        className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-4"
      >
        <div
          className="control-container p-3 rounded-full flex items-center justify-center cursor-pointer transition transform hover:bg-gray-700 hover:scale-105 shadow-lg"
          id="camera-btn"
          onClick={toggleCamera}
        >
          <CameraIcon className="w-4 h-4 text-white" />
        </div>
        <div
          className="control-container p-3 rounded-full flex items-center justify-center cursor-pointer transition transform hover:bg-gray-700 hover:scale-105 shadow-lg"
          id="mic-btn"
          onClick={toggleMic}
        >
          <SpeakerModerateIcon className="w-4 h-4 text-white" />
        </div>
        <div
          className="control-container bg-red-600 p-3 rounded-full flex items-center justify-center cursor-pointer transition transform hover:bg-red-700 hover:scale-105 shadow-lg"
          id="leave-btn"
          onClick={leaveChannel}
        >
          <ExitIcon className="w-4 h-4 text-white" />
        </div>
      </div>
    </div>
  );
};

export default CallRoom;
