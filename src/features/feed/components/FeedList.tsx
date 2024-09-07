import Heading from "../../../shared/components/shadcn-ui/heading";
import React from "react";
import Feed from "./Feed";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../shared/components/shadcn-ui/tabs";

const FeedList = () => {
  return (
    <>
      <div className="flex justify-between items-center">
        <Heading>Feeds</Heading>
        <Tabs defaultValue="popular" className="">
          <TabsList>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="latest">Latest</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Feed />
    </>
  );
};

export default FeedList;
