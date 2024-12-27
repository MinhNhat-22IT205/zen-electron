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
import { PersonIcon } from "@radix-ui/react-icons";
import { Skeleton } from "@/src/shared/components/shadcn-ui/skeleton";

type RoomMemberDialogProps = {
  chatMembers: EndUserMinimal[];
};

const RoomMemberDialog = ({ chatMembers }: RoomMemberDialogProps) => {
  const { activeUserIds } = useActiveUserIdStore();
  const [isOpen, setIsOpen] = useState(false);
  const isOnline = (userId: string) => activeUserIds.includes(userId);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            setIsOpen(true);
          }}
          className="flex items-center gap-2 text-amber-600 hover:text-amber-700"
        >
          <PersonIcon className="h-4 w-4" />
          View Members
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-amber-600">
            Chat Members
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {chatMembers?.length} members in this conversation
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-3">
            {chatMembers?.map((member) => (
              <div
                key={member?._id}
                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-amber-50 transition-colors"
              >
                <Avatar className="h-10 w-10 border-2 border-amber-200">
                  {member?.avatar && (
                    <AvatarImage
                      src={member?.avatar}
                      alt={member?.username}
                      className="object-cover"
                    />
                  )}
                  <AvatarFallback className="bg-amber-100 text-amber-600 font-medium">
                    {member?.username
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {member?.username}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        isOnline(member?._id) ? "bg-amber-500" : "bg-gray-300"
                      }`}
                    />
                    <p
                      className={`text-xs ${
                        isOnline(member?._id)
                          ? "text-amber-600"
                          : "text-gray-500"
                      }`}
                    >
                      {isOnline(member?._id) ? "Online" : "Offline"}
                    </p>
                  </div>
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
