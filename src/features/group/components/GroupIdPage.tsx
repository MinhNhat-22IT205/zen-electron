import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/shared/components/shadcn-ui/avatar";
import { Button } from "@/src/shared/components/shadcn-ui/button";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
} from "@/src/shared/components/shadcn-ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/shared/components/shadcn-ui/dropdown";
import { GroupDetails } from "@/src/shared/types/group.type";
import {
  CalendarIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
  GlobeIcon,
  LockClosedIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import useSWR from "swr";
import React, { useState } from "react";
import { fetcher } from "@/src/shared/libs/swr/fetcher";
import { GROUPS_API_ENDPOINT } from "../api/group.api";
import { useNavigate, useParams } from "react-router-dom";
import CreateGroupPostDialog from "./CreateGroupPostDialog";
import GroupPostList from "./GroupPostList";
import { createGroupRequest } from "../api/group-request.api";
import { IMAGE_BASE_URL } from "@/src/shared/constants/base-paths";
import { useAuthStore } from "@/src/shared/libs/zustand/auth.zustand";
import EditGroupDialogMenuItem from "./EditGroupDialog";
import { deleteGroupMember, leaveGroupApi } from "../api/group-member.api";
import {
  Dialog,
  DialogContent,
} from "@/src/shared/components/shadcn-ui/dialog";

const GroupIdPage = () => {
  const { id: groupId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useSWR<GroupDetails>(
    GROUPS_API_ENDPOINT + `/${groupId}`,
    fetcher,
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const { endUser } = useAuthStore();
  const { group, isJoined, numOfMembers } = data || {};
  const isOwner = useAuthStore(
    (state) => state.endUser?._id === group?.endUserId,
  );
  const [hasSentJoinRequest, setHasSentJoinRequest] = useState(isJoined);

  const handleJoinGroup = async () => {
    if (hasSentJoinRequest) return;
    await createGroupRequest(group._id);
    setHasSentJoinRequest(true);
  };

  const handleLeaveGroup = async () => {
    setIsProcessing(true);
    await leaveGroupApi(group._id);
    setIsProcessing(false);
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error: {error.message}
      </div>
    );

  return (
    <div className="container mx-auto py-6 px-4">
      <Dialog open={isProcessing}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="flex items-center justify-center p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2">Processing...</span>
          </div>
        </DialogContent>
      </Dialog>

      <Card className="mb-6 overflow-hidden shadow-lg rounded-xl">
        <div className="relative h-64 w-full bg-gradient-to-r from-blue-500 to-purple-600">
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative">
          <Avatar className="w-32 h-32 border-4 border-white shadow-xl -mt-16 relative">
            <AvatarImage
              src={IMAGE_BASE_URL + group?.avatar}
              alt={group?.name}
              className="object-cover"
            />
            <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {group?.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <CardTitle className="text-3xl font-bold mb-2">
              {group?.name}
            </CardTitle>
            <p className="text-muted-foreground flex items-center gap-2">
              <span className="font-medium">{numOfMembers} members</span>
              <span>·</span>
              {group?.isVisible ? (
                <span className="flex items-center gap-1">
                  <GlobeIcon className="h-4 w-4 text-green-500" />
                  <span className="text-green-600">Public</span>
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <LockClosedIcon className="h-4 w-4 text-orange-500" />
                  <span className="text-orange-600">Private</span>
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!isOwner && !isJoined && (
              <Button
                variant={
                  isJoined
                    ? "default"
                    : hasSentJoinRequest
                      ? "outline"
                      : "default"
                }
                className={`px-6 py-2 rounded-full transition-all duration-200 ${
                  !hasSentJoinRequest && !isJoined
                    ? "bg-black hover:bg-gray-800 text-white"
                    : ""
                }`}
                onClick={
                  isJoined
                    ? handleLeaveGroup
                    : !hasSentJoinRequest && handleJoinGroup
                }
              >
                {isJoined
                  ? "Leave Group"
                  : hasSentJoinRequest
                    ? "Request Sent"
                    : "Join Group"}
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-full">
                  More <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72 p-2">
                <DropdownMenuLabel className="text-lg font-semibold">
                  Group Details
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    navigate(`/groups/${groupId}/members?isOwner=${isOwner}`)
                  }
                  className="py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <PersonIcon className="mr-2 h-5 w-5 text-blue-500" />
                  <span>{numOfMembers} members</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="py-2">
                  {group?.isVisible ? (
                    <GlobeIcon className="mr-2 h-5 w-5 text-green-500" />
                  ) : (
                    <LockClosedIcon className="mr-2 h-5 w-5 text-orange-500" />
                  )}
                  <span>{group?.isVisible ? "Public" : "Private"} group</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="py-2">
                  <CalendarIcon className="mr-2 h-5 w-5 text-purple-500" />
                  <span>Created {group?.createdAt}</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex flex-col items-start p-3">
                  <span className="font-semibold text-lg mb-2">
                    Description
                  </span>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {group?.description}
                  </p>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {isJoined && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-full">
                    <DotsHorizontalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-2">
                  <DropdownMenuItem
                    onClick={() => navigate(`/groups/${groupId}/requests`)}
                    className="py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <span>View Join Requests</span>
                  </DropdownMenuItem>
                  <EditGroupDialogMenuItem group={group} />
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>
      </Card>

      {isJoined && (
        <div className="space-y-6">
          <CreateGroupPostDialog />
          <GroupPostList />
        </div>
      )}
    </div>
  );
};

export default GroupIdPage;
