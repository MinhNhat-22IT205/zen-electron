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
  PersonIcon,
} from "@radix-ui/react-icons";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import { addMembersToConversation } from "../../api/conversation.api";
import { DropdownMenuItem } from "@/src/shared/components/shadcn-ui/dropdown";
import { Skeleton } from "@/src/shared/components/shadcn-ui/skeleton";

type AddRoomMemberDialogProps = {
  currentRoomMembers: EndUserMinimal[];
  mutateMemberList: () => void;
};

const AddRoomMemberDialog = ({
  currentRoomMembers,
  mutateMemberList,
}: AddRoomMemberDialogProps) => {
  const { id: conversationId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const {
    data: users,
    error,
    isLoading,
  } = useSWR<EndUser[]>(
    isOpen ? `/endusers/search?search=${searchQuery}&limit=100&skip=0` : null,
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
    try {
      await addMembersToConversation(conversationId, selectedUsers);
      setSearchQuery("");
      setSelectedUsers([]);
      setIsOpen(false);
      mutateMemberList();
    } catch (error) {
      console.error("Failed to add members:", error);
    }
  };

  if (error) {
    return (
      <div className="text-red-500 p-4 rounded-md bg-red-50">
        {error.response.data.message}
      </div>
    );
  }

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
          Add Members
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white/95 backdrop-blur-sm">
        {isOpen && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-amber-600">
                Add Chat Members
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Search and select users to add to the chat room.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-2 top-2.5 h-4 w-4 text-amber-500" />
                <Input
                  placeholder="Search users..."
                  className="pl-8 border-amber-200 focus:ring-amber-500 focus:border-amber-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2">
                {isLoading
                  ? Array(3)
                      .fill(0)
                      .map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center space-x-4 py-2"
                        >
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-[150px]" />
                            <Skeleton className="h-3 w-[100px]" />
                          </div>
                        </div>
                      ))
                  : getAvailableUsers()?.map((user) => (
                      <div
                        key={user._id}
                        className="flex items-center space-x-4 p-3 rounded-lg hover:bg-amber-50 transition-colors"
                      >
                        <Checkbox
                          id={`user-${user._id}`}
                          checked={selectedUsers.includes(user._id)}
                          onCheckedChange={() => handleUserToggle(user._id)}
                          className="border-amber-400 text-amber-600"
                        />
                        <label
                          htmlFor={`user-${user._id}`}
                          className="flex items-center space-x-3 text-sm font-medium leading-none cursor-pointer flex-1"
                        >
                          <Avatar className="h-10 w-10 border-2 border-amber-200">
                            <AvatarImage
                              src={user.avatar}
                              alt={user.username}
                            />
                            <AvatarFallback className="bg-amber-100 text-amber-600">
                              {user.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <p className="text-gray-900">{user.username}</p>
                            <p className="text-sm text-gray-500">
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
                className="bg-amber-500 hover:bg-amber-600 text-white transition-colors"
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Members ({selectedUsers.length})
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddRoomMemberDialog;
