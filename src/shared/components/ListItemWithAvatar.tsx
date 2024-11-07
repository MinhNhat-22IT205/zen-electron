import React from "react";
import { Card } from "./shadcn-ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./shadcn-ui/avatar";
import { cn } from "../helpers/cn-tailwind";

export const ListItemWithAvatar: React.FC<{
  avatarSrc?: string;
  avatarFallback: string;
  className?: string;
  children: [
    React.ReactElement<typeof ItemInfo>,
    React.ReactElement<typeof ItemAction>,
  ];
}> = ({ avatarSrc, avatarFallback, className, children }) => {
  const [itemInfo, itemAction] = React.Children.toArray(children);

  return (
    <Card className={cn("p-3", className)}>
      <div className="flex justify-between space-x-4 w-full">
        <Avatar>
          <AvatarImage src={avatarSrc} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        {itemInfo}
        {itemAction}
      </div>
    </Card>
  );
};

export const ItemInfo: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "space-y-1 flex flex-col items-start w-full flex-1",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const ItemAction: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};
