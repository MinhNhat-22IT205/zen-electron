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
  PinRightIcon,
} from "@radix-ui/react-icons";
import useSWR from "swr";
import React, { useState } from "react";
import { fetcher } from "@/src/shared/libs/swr/fetcher";
import { GROUPS_API_ENDPOINT } from "../api/group.api";
import { useNavigate, useParams } from "react-router-dom";
import { Textarea } from "@/src/shared/components/shadcn-ui/textarea";
import CreateGroupPostDialog from "./CreateGroupPostDialog";
import GroupPostList from "./GroupPostList";
import { createGroupRequest } from "../api/group-request.api";
import { IMAGE_BASE_URL } from "@/src/shared/constants/base-paths";

const GroupIdPage = () => {
  const { id: groupId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useSWR<GroupDetails>(
    GROUPS_API_ENDPOINT + `/${groupId}`,
    fetcher,
  );
  const { group, isJoined, numOfMembers } = data || {};
  const [hasSentJoinRequest, setHasSentJoinRequest] = useState(isJoined);

  const handleJoinGroup = async () => {
    if (hasSentJoinRequest) return;
    await createGroupRequest(group._id);
    setHasSentJoinRequest(true);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto py-6">
      <Card className="mb-6 overflow-hidden">
        <div className="relative h-48 w-full">
          {/* <img
            src={group?.avatar}
            alt={`${group?.name} cover`}
            className="object-cover w-full h-full bg-gray-300"
          /> */}
        </div>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Avatar className="w-24 h-24 border-4 border-background -mt-12 relative">
            <AvatarImage
              src={IMAGE_BASE_URL + group?.avatar}
              alt={group?.name}
            />
            <AvatarFallback>{group?.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <CardTitle className="text-2xl">{group?.name}</CardTitle>
            <p className="text-muted-foreground">
              {numOfMembers} members ·{" "}
              {group?.isVisible ? (
                <GlobeIcon className="inline h-4 w-4" />
              ) : (
                <LockClosedIcon className="inline h-4 w-4" />
              )}{" "}
              {group?.isVisible ? "Public" : "Private"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={hasSentJoinRequest ? "outline" : "default"}
              className="w-full"
              onClick={handleJoinGroup}
            >
              {hasSentJoinRequest ? "Leave Group" : "Join Group"}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  More <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64">
                <DropdownMenuLabel>Group Details</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <PersonIcon className="mr-2 h-4 w-4" />
                  <span>{numOfMembers} members</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  {group?.isVisible ? (
                    <GlobeIcon className="mr-2 h-4 w-4" />
                  ) : (
                    <LockClosedIcon className="mr-2 h-4 w-4" />
                  )}
                  <span>{group?.isVisible ? "Public" : "Private"} group</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>Created {group?.createdAt}</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex flex-col items-start">
                  <span className="font-semibold">Description</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    {group?.description}
                  </p>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {isJoined && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="mx-2">
                    <DotsHorizontalIcon className="h-4 w-4" />
                    <h1> </h1>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => navigate(`/groups/${groupId}/requests`)}
                  >
                    <PersonIcon className="mr-2 h-4 w-4" />
                    <span>View Join Requests</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>
      </Card>

      {isJoined && (
        <>
          <CreateGroupPostDialog />

          <GroupPostList />
        </>
      )}
    </div>
  );
};

export default GroupIdPage;
