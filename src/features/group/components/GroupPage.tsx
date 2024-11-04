import {
  Tabs,
  TabsTrigger,
  TabsList,
  TabsContent,
} from "@/src/shared/components/shadcn-ui/tabs";
import React from "react";
import DiscoveryGroupList from "./group-list/DiscoveryGroupList";
import YourGroupList from "./group-list/YourGroupList";
import CreateGroupDialog from "./CreateGroupDialog";

const GroupPage = () => {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Groups</h1>
        <CreateGroupDialog />
      </div>
      <Tabs defaultValue="discovery" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="discovery">Discovery</TabsTrigger>
          <TabsTrigger value="your-groups">Your Groups</TabsTrigger>
        </TabsList>
        <TabsContent value="discovery">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <DiscoveryGroupList />
          </div>
        </TabsContent>
        <TabsContent value="your-groups">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <YourGroupList />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GroupPage;
