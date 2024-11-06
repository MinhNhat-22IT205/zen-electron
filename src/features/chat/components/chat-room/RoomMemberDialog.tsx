import { Button } from "@/src/shared/components/shadcn-ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/shared/components/shadcn-ui/dialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/shared/components/shadcn-ui/avatar";
import { ScrollArea } from "@/src/shared/components/shadcn-ui/scroll-area";
import React, { useState } from "react";
import { EndUserMinimal } from "@/src/shared/types/enduser.type";
import { useActiveUserIdStore } from "@/src/shared/libs/zustand/active-user.zustand";
import { DropdownMenuItem } from "@/src/shared/components/shadcn-ui/dropdown";

type RoomMemberDialogProps = {
  chatMembers: EndUserMinimal[];
};
const RoomMemberDialog = ({ chatMembers }: RoomMemberDialogProps) => {
  const { activeUserIds } = useActiveUserIdStore();
  const [isOpen, setIsOpen] = useState(false);
  const isOnline = (userId: string) => {
    return activeUserIds.includes(userId);
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => {
            // Prevent the dropdown from closing
            e.preventDefault();
            setIsOpen(true);
          }}
        >
          View Members
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chat Members</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          {chatMembers?.length} members in this chat
        </DialogDescription>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4">
            {chatMembers?.map((member) => (
              <div key={member?._id} className="flex items-center space-x-4">
                <Avatar>
                  {member?.avatar && (
                    <AvatarImage src={member?.avatar} alt={member?.username} />
                  )}
                  <AvatarFallback>
                    {member?.username
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {member?.username}
                  </p>
                  <p
                    className={`text-xs ${isOnline(member?._id) ? "text-green-500" : "text-gray-500"}`}
                  >
                    {isOnline(member?._id) ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default RoomMemberDialog;
