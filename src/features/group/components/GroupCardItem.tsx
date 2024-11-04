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

type GroupCardItemProps = {
  group: GroupWithMembershipInfo | Group;
};

const GroupCardItem = ({ group }: GroupCardItemProps) => {
  const navigate = useNavigate();
  const [hasSentJoinRequest, setHasSentJoinRequest] = useState(
    "isJoined" in group && group.isJoined,
  );

  const handleJoinGroup = async () => {
    if (hasSentJoinRequest) return;
    await createGroupRequest(group._id);
    setHasSentJoinRequest(true);
  };

  return (
    <Card
      className="overflow-hidden"
      onClick={() => {
        navigate(`/groups/${group._id}`);
      }}
    >
      <div className="relative h-48 w-full">
        <img
          src={IMAGE_BASE_URL + group.avatar}
          alt={`${group.name} banner`}
          className="object-cover w-full h-full"
        />
      </div>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{group.name}</span>
        </CardTitle>
        {"numOfMembers" in group && (
          <CardDescription>{group.numOfMembers} members</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <p className="line-clamp-2">{group.description}</p>
      </CardContent>
      <CardFooter>
        {"isJoined" in group && (
          <Button
            variant={hasSentJoinRequest ? "outline" : "default"}
            className="w-full"
            onClick={handleJoinGroup}
          >
            {hasSentJoinRequest ? "Leave Group" : "Join Group"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default GroupCardItem;
