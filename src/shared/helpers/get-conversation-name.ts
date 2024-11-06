import { EndUserMinimal } from "../types/enduser.type";

export const getConversationName = (endUsers: EndUserMinimal[]): string => {
  if (!endUsers) return "";
  return endUsers.length > 2
    ? endUsers
        .slice(0, 2)
        .map((endUser) => endUser.username)
        .join(", ") + ` and ${endUsers.length - 2} others`
    : endUsers[0].username;
};
