import { Button } from "../../../../shared/components/shadcn-ui/button";
import { Input } from "../../../../shared/components/shadcn-ui/input";
import { ScrollArea } from "../../../../shared/components/shadcn-ui/scroll-area";
import Text from "../../../../shared/components/shadcn-ui/text";
import {
  DotsHorizontalIcon,
  LockClosedIcon,
  CircleIcon,
} from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/shared/components/shadcn-ui/dialog";

import React, { useEffect, useState } from "react";
import MessageList from "./MessageList";
import useSWR from "swr";
import { CONVERSTAION_API_ENDPOINT } from "../../api/chat-endpoints.api";
import { useNavigate, useParams } from "react-router-dom";
import { fetcher } from "@/src/shared/libs/swr/fetcher";
import { Conversation } from "@/src/shared/types/conversation.type";
import { useAuthStore } from "@/src/shared/libs/zustand/auth.zustand";
import { useUnreadConversationStore } from "@/src/shared/libs/zustand/unread-conversation.zustand";
import AddRoomMemberDialog from "./AddRoomMemberDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/shared/components/shadcn-ui/dropdown";
import RoomMemberDialog from "./RoomMemberDialog";
import { getConversationName } from "@/src/shared/helpers/get-conversation-name";
import { useToast } from "@/src/shared/hooks/use-toast";
import http from "@/src/shared/libs/axios/axios.base";
import { useConversationActiveStore } from "@/src/shared/libs/zustand/conversation-active.zustand";
import FilesDialog from "./FilesDialog";
import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/src/shared/components/shadcn-ui/alertDialog";
import { useActiveUserIdStore } from "@/src/shared/libs/zustand/active-user.zustand";
import { useConversationIsLocalStore } from "@/src/shared/libs/zustand/conversation-is-local.zustand";
import { Switch } from "@/src/shared/components/shadcn-ui/switch";
import { Label } from "@/src/shared/components/shadcn-ui/label";

const ChatRoom = () => {
  const { activeUserIds } = useActiveUserIdStore();

  const conversationActiveStore = useConversationActiveStore((state) => state);
  const { toast } = useToast();
  const [encryptionKey, setEncryptionKey] = useState<string>("");
  const [verifyEncryptionKey, setVerifyEncryptionKey] = useState<string>("");
  const [openEncryptionKeyDialog, setOpenEncryptionKeyDialog] =
    useState<boolean>(false);
  const [openVerifyEncryptionKeyDialog, setOpenVerifyEncryptionKeyDialog] =
    useState<boolean>(false);
  const navigate = useNavigate();
  const { id: conversationId } = useParams();
  const unreadConversationStore = useUnreadConversationStore((state) => state);
  const myEndUserId = useAuthStore((state) => state.endUser?._id);
  const { conversationIsLocal, setConversationIsLocal } =
    useConversationIsLocalStore();

  const [isInLocal, setIsInLocal] = useState<boolean>(false);

  const {
    data: conversation,
    mutate,
    error,
  } = useSWR<Conversation>(
    CONVERSTAION_API_ENDPOINT +
      "/" +
      conversationId +
      "?encryptionKey=" +
      conversationActiveStore.conversations[conversationId],
    fetcher,
    {
      revalidateOnFocus: false,
    },
  );

  const onChangeEncryptionKey = async () => {
    const response = await http.patch(
      CONVERSTAION_API_ENDPOINT + `/${conversationId}/create-encryption-key`,
      {
        conversationId: conversationId,
        encryptionKey: encryptionKey,
      },
    );
    if (response.status === 200) {
      toast({
        title: "Encryption key set successfully",
      });
      setOpenEncryptionKeyDialog(false);
    }
  };
  const onVerifyEncryptionKey = async () => {
    try {
      const response = await http.get(
        CONVERSTAION_API_ENDPOINT +
          `/${conversationId}?encryptionKey=${verifyEncryptionKey}`,
      );
      if (response.status === 200) {
        toast({
          title: "Encryption key verified successfully",
        });
        setOpenVerifyEncryptionKeyDialog(false);
        conversationActiveStore.setConversations({
          ...conversationActiveStore.conversations,
          [conversationId]: verifyEncryptionKey,
        });
      }
    } catch (error) {
      toast({
        title: "Encryption key verification failed",
        description: error.response?.data.message,
      });
    }
  };

  useEffect(() => {
    unreadConversationStore.removeUnreadConversationId(conversationId);
  }, [conversationId]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error.response?.data.message,
      });
      setOpenVerifyEncryptionKeyDialog(true);
    }
  }, [error]);

  const onSetConversationToLocal = async () => {
    if (!isInLocal) {
      if (
        activeUserIds.includes(
          conversation?.endUserIds[0]._id !== myEndUserId
            ? conversation?.endUserIds[0]._id
            : conversation?.endUserIds[1]._id,
        )
      ) {
        setIsInLocal(true);
        setConversationIsLocal({
          ...conversationIsLocal,
          [conversationId]: true,
        });
      } else {
        toast({
          title: "Error",
          description:
            "Other users must be online to set this conversation to peer to peer",
        });
      }
    } else {
      setIsInLocal(false);
      setConversationIsLocal({
        ...conversationIsLocal,
        [conversationId]: false,
      });
    }
  };

  return (
    <>
      {conversationActiveStore.conversations[conversationId] !==
        verifyEncryptionKey && error ? (
        <Dialog open={openVerifyEncryptionKeyDialog}>
          <DialogTrigger>
            <Button variant="ghost">
              <LockClosedIcon />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Verify Encryption Key</DialogTitle>
              <DialogDescription>
                <h1>
                  Because you are using encryption key, please verify your key
                </h1>
                <Input
                  type="password"
                  value={verifyEncryptionKey}
                  onChange={(e) => setVerifyEncryptionKey(e.target.value)}
                />
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={onVerifyEncryptionKey}>Verify</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <div className="w-full h-full flex flex-col">
          <div className="flex justify-between items-center p-2 border-b">
            <Text className="flex-1 font-bold">
              {getConversationName(conversation?.endUserIds, myEndUserId)}
            </Text>
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => setOpenEncryptionKeyDialog(true)}
              >
                <LockClosedIcon />
              </Button>
              {/* Set a (is local) property Dialog to make it private on your own computer or not */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="airplane-mode"
                  checked={isInLocal}
                  onCheckedChange={onSetConversationToLocal}
                />
                <Label htmlFor="airplane-mode">Private</Label>
              </div>

              {/* Set encryption key */}
              <Dialog
                open={openEncryptionKeyDialog}
                onOpenChange={setOpenEncryptionKeyDialog.bind(null, false)}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Set Encryption Key</DialogTitle>
                    <DialogDescription>
                      <Input
                        type="password"
                        value={encryptionKey}
                        onChange={(e) => setEncryptionKey(e.target.value)}
                      />
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button onClick={onChangeEncryptionKey}>Set</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Call Icon */}
              <Button
                variant="ghost"
                className="rounded-full"
                onClick={() =>
                  navigate(
                    `/call-room?conversationId=${conversationId}&isSender=true`,
                  )
                }
              >
                <svg
                  fill="#000000"
                  height="20px"
                  width="20px"
                  version="1.1"
                  id="Capa_1"
                  viewBox="0 0 473.806 473.806"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <g>
                      <g>
                        <path d="M374.456,293.506c-9.7-10.1-21.4-15.5-33.8-15.5c-12.3,0-24.1,5.3-34.2,15.4l-31.6,31.5c-2.6-1.4-5.2-2.7-7.7-4 c-3.6-1.8-7-3.5-9.9-5.3c-29.6-18.8-56.5-43.3-82.3-75c-12.5-15.8-20.9-29.1-27-42.6c8.2-7.5,15.8-15.3,23.2-22.8 c2.8-2.8,5.6-5.7,8.4-8.5c21-21,21-48.2,0-69.2l-27.3-27.3c-3.1-3.1-6.3-6.3-9.3-9.5c-6-6.2-12.3-12.6-18.8-18.6 c-9.7-9.6-21.3-14.7-33.5-14.7s-24,5.1-34,14.7c-0.1,0.1-0.1,0.1-0.2,0.2l-34,34.3c-12.8,12.8-20.1,28.4-21.7,46.5 c-2.4,29.2,6.2,56.4,12.8,74.2c16.2,43.7,40.4,84.2,76.5,127.6c43.8,52.3,96.5,93.6,156.7,122.7c23,10.9,53.7,23.8,88,26 c2.1,0.1,4.3,0.2,6.3,0.2c23.1,0,42.5-8.3,57.7-24.8c0.1-0.2,0.3-0.3,0.4-0.5c5.2-6.3,11.2-12,17.5-18.1c4.3-4.1,8.7-8.4,13-12.9 c9.9-10.3,15.1-22.3,15.1-34.6c0-12.4-5.3-24.3-15.4-34.3L374.456,293.506z M410.256,398.806 C410.156,398.806,410.156,398.906,410.256,398.806c-3.9,4.2-7.9,8-12.2,12.2c-6.5,6.2-13.1,12.7-19.3,20 c-10.1,10.8-22,15.9-37.6,15.9c-1.5,0-3.1,0-4.6-0.1c-29.7-1.9-57.3-13.5-78-23.4c-56.6-27.4-106.3-66.3-147.6-115.6 c-34.1-41.1-56.9-79.1-72-119.9c-9.3-24.9-12.7-44.3-11.2-62.6c1-11.7,5.5-21.4,13.8-29.7l34.1-34.1c4.9-4.6,10.1-7.1,15.2-7.1 c6.3,0,11.4,3.8,14.6,7c0.1,0.1,0.2,0.2,0.3,0.3c6.1,5.7,11.9,11.6,18,17.9c3.1,3.2,6.3,6.4,9.5,9.7l27.3,27.3 c10.6,10.6,10.6,20.4,0,31c-2.9,2.9-5.7,5.8-8.6,8.6c-8.4,8.6-16.4,16.6-25.1,24.4c-0.2,0.2-0.4,0.3-0.5,0.5 c-8.6,8.6-7,17-5.2,22.7c0.1,0.3,0.2,0.6,0.3,0.9c7.1,17.2,17.1,33.4,32.3,52.7l0.1,0.1c27.6,34,56.7,60.5,88.8,80.8 c4.1,2.6,8.3,4.7,12.3,6.7c3.6,1.8,7,3.5,9.9,5.3c0.4,0.2,0.8,0.5,1.2,0.7c3.4,1.7,6.6,2.5,9.9,2.5c8.3,0,13.5-5.2,15.2-6.9 l34.2-34.2c3.4-3.4,8.8-7.5,15.1-7.5c6.2,0,11.3,3.9,14.4,7.3c0.1,0.1,0.1,0.1,0.2,0.2l55.1,55.1 C420.456,377.706,420.456,388.206,410.256,398.806z"></path>{" "}
                        <path d="M256.056,112.706c26.2,4.4,50,16.8,69,35.8s31.3,42.8,35.8,69c1.1,6.6,6.8,11.2,13.3,11.2c0.8,0,1.5-0.1,2.3-0.2 c7.4-1.2,12.3-8.2,11.1-15.6c-5.4-31.7-20.4-60.6-43.3-83.5s-51.8-37.9-83.5-43.3c-7.4-1.2-14.3,3.7-15.6,11 S248.656,111.506,256.056,112.706z"></path>{" "}
                        <path d="M473.256,209.006c-8.9-52.2-33.5-99.7-71.3-137.5s-85.3-62.4-137.5-71.3c-7.3-1.3-14.2,3.7-15.5,11 c-1.2,7.4,3.7,14.3,11.1,15.6c46.6,7.9,89.1,30,122.9,63.7c33.8,33.8,55.8,76.3,63.7,122.9c1.1,6.6,6.8,11.2,13.3,11.2 c0.8,0,1.5-0.1,2.3-0.2C469.556,223.306,474.556,216.306,473.256,209.006z"></path>{" "}
                      </g>{" "}
                    </g>{" "}
                  </g>
                </svg>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">
                    <DotsHorizontalIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <AddRoomMemberDialog
                    currentRoomMembers={conversation?.endUserIds}
                    mutateMemberList={mutate}
                  />
                  <RoomMemberDialog chatMembers={conversation?.endUserIds} />
                  <FilesDialog conversationId={conversationId} />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {/* Chat Messages & Message Input */}
          <MessageList />
        </div>
      )}
    </>
  );
};

export default ChatRoom;
