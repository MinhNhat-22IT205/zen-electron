import { useActiveUserIdStore } from "@/src/shared/libs/zustand/active-user.zustand";
import { useAuthStore } from "@/src/shared/libs/zustand/auth.zustand";
import { useCallRequestDialogStore } from "@/src/shared/libs/zustand/call-request-dialog.zustand";
import { useSocketStore } from "@/src/shared/libs/zustand/socket-instance.zustand";
import { EndUser } from "@/src/shared/types/enduser.type";
import { useEffect } from "react";
import { Socket } from "socket.io-client";

const useOutsideListenerSocket = (clientSocket: Socket) => {
  const myEndUser = useAuthStore((state) => state.endUser);
  const activeUserIdStore = useActiveUserIdStore();
  const callDialogStore = useCallRequestDialogStore();
  const { setSocket } = useSocketStore();

  useEffect(() => {
    setSocket(clientSocket);
    clientSocket.emit("endUserConnect", { endUserId: myEndUser._id });

    const activeListInterval = setInterval(() => {
      clientSocket.emit("activeList", {});
    }, 5000);

    const handleRequestCall = ({
      conversationId,
      sender,
    }: {
      conversationId: string;
      sender: EndUser;
    }) => {
      callDialogStore.setCaller(sender);
      callDialogStore.setCallingConversationId(conversationId);
      callDialogStore.open();
    };

    const handleActiveList = ({ activeList }: { activeList: string[] }) => {
      activeUserIdStore.setActiveUserIds(activeList);
    };

    clientSocket.on("activeList", handleActiveList);
    clientSocket.on("requestCall", handleRequestCall);

    return () => {
      clearInterval(activeListInterval);
      clientSocket.off("activeList", handleActiveList);
      clientSocket.off("requestCall", handleRequestCall);
    };
  }, [clientSocket, myEndUser, callDialogStore, activeUserIdStore, setSocket]);

  const denyCall = () => {
    clientSocket.emit("requestDeny", {
      conversationId: callDialogStore.callingConversationId,
      fromEndUser: myEndUser,
    });
  };

  return { denyCall };
};

export default useOutsideListenerSocket;
