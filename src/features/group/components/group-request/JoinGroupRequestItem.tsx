import {
  ItemAction,
  ItemInfo,
  ListItemWithAvatar,
} from "@/src/shared/components/ListItemWithAvatar";
import { Button } from "@/src/shared/components/shadcn-ui/button";
import { IMAGE_BASE_URL } from "@/src/shared/constants/base-paths";
import { JoinGroupRequest } from "@/src/shared/types/join-group-request.type";
import React from "react";
import {
  acceptJoinGroupRequest,
  declineJoinGroupRequest,
} from "../../api/group-request.api";

type JoinGroupRequestItemProps = {
  joinGroupRequest: JoinGroupRequest;
  onMutate: () => void;
};
const JoinGroupRequestItem = ({
  joinGroupRequest,
  onMutate,
}: JoinGroupRequestItemProps) => {
  const handleAcceptJoinGroupRequest = async () => {
    await acceptJoinGroupRequest(
      joinGroupRequest.endUserId._id,
      joinGroupRequest.groupId,
    );
    onMutate();
  };
  const handleDeclineJoinGroupRequest = async () => {
    await declineJoinGroupRequest(
      joinGroupRequest.endUserId._id,
      joinGroupRequest.groupId,
    );
    onMutate();
  };
  return (
    <ListItemWithAvatar
      avatarFallback={joinGroupRequest.endUserId.username}
      avatarSrc={IMAGE_BASE_URL + joinGroupRequest.endUserId.avatar}
    >
      <ItemInfo>
        <h4 className="text-sm font-semibold">
          {joinGroupRequest.endUserId.username}
        </h4>
      </ItemInfo>
      <ItemAction>
        <Button onClick={handleAcceptJoinGroupRequest} color="green">
          Accept
        </Button>
        <Button onClick={handleDeclineJoinGroupRequest} color="red">
          Decline
        </Button>
      </ItemAction>
    </ListItemWithAvatar>
  );
};

export default JoinGroupRequestItem;
