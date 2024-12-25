import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/shared/components/shadcn-ui/avatar";
import { Button } from "@/src/shared/components/shadcn-ui/button";
import { Card } from "@/src/shared/components/shadcn-ui/card";
import { IMAGE_BASE_URL } from "@/src/shared/constants/base-paths";
import { EndUser } from "@/src/shared/types/enduser.type";
import {
  CalendarIcon,
  PaperPlaneIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import React from "react";
import { Link } from "react-router-dom";

type EnduserSearchItemProps = {
  endUser: EndUser;
};

const EnduserSearchItem = ({ endUser }: EnduserSearchItemProps) => {
  return (
    <Card className="p-4 hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-amber-50/50 to-white border border-amber-100">
      <div className="flex items-start space-x-4">
        <Avatar className="h-16 w-16 ring-2 ring-amber-200 ring-offset-2">
          <AvatarImage src={IMAGE_BASE_URL + endUser.avatar} />
          <AvatarFallback className="bg-amber-100 text-amber-700">
            <PersonIcon className="h-8 w-8" />
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-lg font-bold text-amber-900 truncate">
                {endUser.username}
              </h4>
              <div className="flex items-center text-amber-600 text-xs mt-1">
                <CalendarIcon className="mr-1 h-3 w-3" />
                <span>
                  Joined{" "}
                  {new Date(endUser.createdAt).toLocaleString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            <Link
              to={"/conversations/create-conversation?userId=" + endUser._id}
            >
              <Button
                variant="ghost"
                className="hover:bg-amber-100 text-amber-700 hover:text-amber-900"
              >
                <PaperPlaneIcon className="h-4 w-4 mr-2" />
                Message
              </Button>
            </Link>
          </div>

          <p className="mt-2 text-sm text-amber-700 line-clamp-2">
            {endUser.description || "No description available"}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default EnduserSearchItem;
