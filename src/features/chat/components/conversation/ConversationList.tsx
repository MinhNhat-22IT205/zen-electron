import React from "react";
import ConversationItem from "./ConversationItem";
import { ScrollArea } from "../../../../shared/components/shadcn-ui/scroll-area";

const ConversationList = () => {
  return (
    <ScrollArea className="h-full w-full">
      <ConversationItem />
      <ConversationItem />
      <ConversationItem />
    </ScrollArea>
  );
};

export default ConversationList;
