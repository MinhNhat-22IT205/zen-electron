import { Outlet } from "react-router-dom";
import ConversationList from "./conversation/ConversationList";
import { io } from "socket.io-client";
import useOutsideListenerSocket from "../hooks/useOutsideListenerSocket";
import { SERVER_SOCKET_URL } from "@/src/shared/libs/socketio/client-socket.base";
import CallRequestDialog from "./call/CallRequestDialog";
import { useCallRequestDialogStore } from "@/src/shared/libs/zustand/call-request-dialog.zustand";

const clientSocket = io(SERVER_SOCKET_URL);
const ChatPage = () => {
  const { isOpen, open, close, caller, callingConversationId } =
    useCallRequestDialogStore();
  const { denyCall } = useOutsideListenerSocket(clientSocket);

  return (
    <>
      <div className="h-screen w-full flex flex-col ">
        <div className="flex w-full h-full flex-1">
          <div className="w-80 h-full bg-white border border-gray-200">
            <ConversationList />
          </div>
          <div className="h-full w-full">
            {/* ChatRoom */}
            <Outlet />
          </div>
        </div>
      </div>
      <CallRequestDialog
        isOpen={isOpen}
        open={open}
        close={close}
        caller={caller}
        callingConversationId={callingConversationId}
        denyCall={() => {
          denyCall();
          close();
        }}
      />
    </>
  );
};

export default ChatPage;
