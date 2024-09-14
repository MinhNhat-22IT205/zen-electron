import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/shared/components/shadcn-ui/avatar";
import { Button } from "@/src/shared/components/shadcn-ui/button";
import { Card } from "@/src/shared/components/shadcn-ui/card";
import { EndUser } from "@/src/shared/types/enduser.type";
import { CalendarIcon, PaperPlaneIcon } from "@radix-ui/react-icons";
import React from "react";

type EnduserSearchItemProps = {
  endUser: EndUser;
};

const EnduserSearchItem = ({ endUser }: EnduserSearchItemProps) => {
  return (
    <Card className="p-3">
      <div className="flex justify-between space-x-4 w-full">
        <Avatar>
          <AvatarImage src="https://github.com/vercel.png" />
          <AvatarFallback>{endUser.username}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h4 className="text-sm font-semibold">{endUser.username}</h4>
          <p className="text-sm">
            The React Framework – created and maintained by @vercel.
          </p>
          <div className="flex items-center pt-2">
            <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
            <span className="text-xs text-muted-foreground">
              Joined December 2021
            </span>
          </div>
        </div>
        <Button variant="secondary">
          Message
          <PaperPlaneIcon className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </Card>
  );
};

export default EnduserSearchItem;
