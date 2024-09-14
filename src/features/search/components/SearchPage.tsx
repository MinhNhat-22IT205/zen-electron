import { Input } from "@/src/shared/components/shadcn-ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/shared/components/shadcn-ui/tabs";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import EnduserSearchList from "./EnduserSearchList";
import FeedSearchList from "./FeedSearchList";

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q");
  const searchType = searchParams.get("t");
  const [selectedTab, setSelectedTab] = useState(searchType);
  return (
    <div className="w-full pr-4">
      <div className="w-fit mx-auto">
        <div className="flex items-center w-full bg-white rounded-lg border border-gray-300 dark:bg-gray-900 px-3.5 py-2">
          <MagnifyingGlassIcon className="h-4 w-4" />
          <Input
            type="search"
            placeholder="Search"
            defaultValue={searchQuery}
            className="w-full border-0  h-8 font-semibold"
            // focus:!outline-none focus-visible:!ring-0
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                navigate(`/search?t=${searchType}&q=${e.currentTarget.value}`);
              }
            }}
          />
        </div>
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="max-w-[600px] min-w-[400px]"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="user">user</TabsTrigger>
            <TabsTrigger value="feed">feed</TabsTrigger>
          </TabsList>
          <TabsContent value="user">
            <EnduserSearchList searchQuery={searchQuery} />
          </TabsContent>
          <TabsContent value="feed">
            <FeedSearchList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SearchPage;
