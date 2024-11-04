import { EndUserMinimal } from "./enduser.type";

type Group = {
  _id: string;
  name: string;
  description: string;
  avatar: string;
  endUserId: string;
  isVisible: boolean;
  createdAt: string;
};

type GroupMinimal = Pick<Group, "_id" | "name" | "avatar" | "isVisible">;

type GroupWithMembershipInfo = Group & {
  numOfMembers: number;
  isJoined: boolean;
};

type GroupDetails = {
  group: Group;
  isJoined: boolean;
  numOfMembers: number;
};

type YourGroupData = {
  groupsJoined: { _id: string; groupId: Group }[];
  groupsCreated: (Group & { endUser: EndUserMinimal })[];
};

type GroupMember = EndUserMinimal & { isOwner: boolean };

export {
  Group,
  GroupDetails,
  GroupWithMembershipInfo,
  GroupMinimal,
  GroupMember,
  YourGroupData,
};
