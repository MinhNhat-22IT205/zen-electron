import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/shared/components/shadcn-ui/avatar";
import { Button } from "@/src/shared/components/shadcn-ui/button";
import { Checkbox } from "@/src/shared/components/shadcn-ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/shared/components/shadcn-ui/dialog";
import { Input } from "@/src/shared/components/shadcn-ui/input";
import { fetcher } from "@/src/shared/libs/swr/fetcher";
import { EndUser, EndUserMinimal } from "@/src/shared/types/enduser.type";
import {
  DotsHorizontalIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import React, { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import { addMembersToConversation } from "../../api/conversation.api";

type AddRoomMemberDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentRoomMembers: EndUserMinimal[];
};
const AddRoomMemberDialog = ({
  isOpen,
  setIsOpen,
  currentRoomMembers,
}: AddRoomMemberDialogProps) => {
  const { id: conversationId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const { data: users, error } = useSWR<EndUser[]>(
    `/endusers/search?search=${searchQuery}&limit=100&skip=0`,
    fetcher,
  );
  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const getAvailableUsers = () => {
    return users?.filter(
      (user) => !currentRoomMembers.some((member) => member._id === user._id),
    );
  };

  const handleAddMembers = async () => {
    await addMembersToConversation(conversationId, selectedUsers);
    setSearchQuery("");
    setSelectedUsers([]);
    closeDialog();
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  if (error) {
    return <div>{error.response.data.message}</div>;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Chat Members</DialogTitle>
          <DialogDescription>
            Search and select users to add to the chat room.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="max-h-[200px] overflow-y-auto">
            {getAvailableUsers()?.map((user) => (
              <div key={user._id} className="flex items-center space-x-4 py-2">
                <Checkbox
                  id={`user-${user._id}`}
                  checked={selectedUsers.includes(user._id)}
                  onCheckedChange={() => handleUserToggle(user._id)}
                />
                <label
                  htmlFor={`user-${user._id}`}
                  className="flex items-center space-x-3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.username} />
                    <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p>{user.username}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleAddMembers}
            disabled={selectedUsers.length === 0}
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Members ({selectedUsers.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddRoomMemberDialog;
