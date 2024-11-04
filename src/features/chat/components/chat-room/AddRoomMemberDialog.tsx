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
import { EndUser } from "@/src/shared/types/enduser.type";
import {
  DotsHorizontalIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import React, { useState } from "react";
import useSWR from "swr";

const AddRoomMemberDialog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const { data: users } = useSWR<EndUser[]>(
    `/endusers/search?search=${searchQuery}`,
    fetcher,
  );
  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleAddMembers = () => {
    console.log(selectedUsers);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="rounded-full">
          <DotsHorizontalIcon />
        </Button>{" "}
      </DialogTrigger>
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
            {users?.map((user) => (
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
