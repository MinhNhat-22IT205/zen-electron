import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/shared/components/shadcn-ui/avatar";
import { Button } from "@/src/shared/components/shadcn-ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/shared/components/shadcn-ui/card";
import { Group, GroupWithMembershipInfo } from "@/src/shared/types/group.type";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createGroupRequest } from "../api/group-request.api";
import { IMAGE_BASE_URL } from "@/src/shared/constants/base-paths";
import { GlobeIcon, LockClosedIcon } from "@radix-ui/react-icons";

type GroupCardItemProps = {
  group: GroupWithMembershipInfo | Group;
};

const GroupCardItem = ({ group }: GroupCardItemProps) => {
  const navigate = useNavigate();
  const isJoined = "isJoined" in group && group.isJoined;
  const [hasSentJoinRequest, setHasSentJoinRequest] = useState(isJoined);

  const handleJoinGroup = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasSentJoinRequest) return;
    await createGroupRequest(group._id);
    setHasSentJoinRequest(true);
  };

  return (
    <Card
      className="overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer group"
      onClick={() => navigate(`/groups/${group._id}`)}
    >
      <div className="relative h-48 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
        <img
          src={IMAGE_BASE_URL + group.avatar}
          alt={`${group.name} banner`}
          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          {group.isVisible ? (
            <div className="flex items-center gap-1 bg-green-500/80 text-white px-3 py-1 rounded-full text-sm">
              <GlobeIcon className="h-4 w-4" />
              <span>Public</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 bg-orange-500/80 text-white px-3 py-1 rounded-full text-sm">
              <LockClosedIcon className="h-4 w-4" />
              <span>Private</span>
            </div>
          )}
        </div>
      </div>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-xl">
          <span className="font-bold">{group.name}</span>
        </CardTitle>
        {"numOfMembers" in group && (
          <CardDescription className="text-sm font-medium">
            {group.numOfMembers} members
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <p className="line-clamp-2 text-gray-600 dark:text-gray-300">
          {group.description}
        </p>
      </CardContent>
      <CardFooter>
        {"isJoined" in group && (
          <Button
            variant={hasSentJoinRequest ? "outline" : "default"}
            className={`w-full transition-all duration-200 ${
              !hasSentJoinRequest
                ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                : "border-2"
            }`}
            onClick={handleJoinGroup}
          >
            {isJoined
              ? "Leave Group"
              : hasSentJoinRequest
                ? "Request Sent"
                : "Join Group"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default GroupCardItem;
