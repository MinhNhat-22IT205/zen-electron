import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/shared/components/shadcn-ui/avatar";
import { Button } from "@/src/shared/components/shadcn-ui/button";
import { Card } from "@/src/shared/components/shadcn-ui/card";
import { IMAGE_BASE_URL } from "@/src/shared/constants/base-paths";
import { EndUser } from "@/src/shared/types/enduser.type";
import { CalendarIcon, PaperPlaneIcon } from "@radix-ui/react-icons";
import React from "react";
import { Link } from "react-router-dom";

type EnduserSearchItemProps = {
  endUser: EndUser;
};

const EnduserSearchItem = ({ endUser }: EnduserSearchItemProps) => {
  return (
    <Card className="p-3">
      <div className="flex justify-between space-x-4 w-full">
        <Avatar>
          <AvatarImage src={IMAGE_BASE_URL + endUser.avatar} />
          <AvatarFallback>{endUser.username}</AvatarFallback>
        </Avatar>
        <div className="space-y-1 flex flex-col items-start w-full flex-1">
          <h4 className="text-sm font-semibold">{endUser.username}</h4>
          <p className="text-sm">{endUser.description}</p>
          <div className="flex items-center pt-2">
            <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
            <span className="text-xs text-muted-foreground">
              {new Date(endUser.createdAt).toLocaleString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
        <Button variant="secondary">
          <Link
            to={"/conversations/create-conversation?userId=" + endUser._id}
            className="flex gap-1 items-center"
          >
            Message
            <PaperPlaneIcon className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </div>
    </Card>
  );
};

export default EnduserSearchItem;
