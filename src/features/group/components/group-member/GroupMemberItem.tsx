import {
  ItemAction,
  ItemInfo,
  ListItemWithAvatar,
} from "@/src/shared/components/ListItemWithAvatar";
import { IMAGE_BASE_URL } from "@/src/shared/constants/base-paths";
import React from "react";
import { GroupMember } from "@/src/shared/types/group.type";
import { Button } from "@/src/shared/components/shadcn-ui/button";

type GroupMemberItemProps = {
  groupMember: GroupMember;
  isOwner: boolean;
  onDelete: () => void;
};
const GroupMemberItem = ({
  groupMember,
  isOwner,
  onDelete,
}: GroupMemberItemProps) => {
  return (
    <ListItemWithAvatar
      avatarSrc={IMAGE_BASE_URL + groupMember.endUser.avatar}
      avatarFallback={groupMember.endUser.username}
    >
      <ItemInfo>
        <h4 className="text-sm font-semibold">
          {groupMember.endUser.username}
        </h4>
      </ItemInfo>
      <ItemAction>
        {isOwner && <Button onClick={() => onDelete()}>Delete</Button>}
      </ItemAction>
    </ListItemWithAvatar>
  );
};

export default GroupMemberItem;
