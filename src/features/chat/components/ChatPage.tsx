import { Button } from "../../../shared/components/shadcn-ui/button";
import { ArrowLeftIcon, TriangleLeftIcon } from "@radix-ui/react-icons";
import { Outlet, useNavigate } from "react-router-dom";
import ConversationList from "./conversation/ConversationList";
import { io } from "socket.io-client";
import useOutsideListenerSocket from "../hooks/useOutsideListenerSocket";
import { SERVER_SOCKET_URL } from "@/src/shared/libs/socketio/client-socket.base";

const clientSocket = io(SERVER_SOCKET_URL);
const ChatPage = () => {
  const navigate = useNavigate();
  useOutsideListenerSocket(clientSocket);

  return (
    <div className="h-screen w-full flex flex-col ">
      <div className="flex w-full h-full flex-1">
        <div className="w-64 h-full bg-white border border-gray-200">
          <ConversationList />
        </div>
        <div className="h-full w-full">
          {/* ChatRoom */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
