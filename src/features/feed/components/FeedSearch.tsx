import { Input } from "../../../shared/components/shadcn-ui/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import React from "react";

const FeedSearch = () => {
  return (
    <div className="flex items-center w-[300px] bg-white max-w-sm space-x-2 rounded-lg border border-gray-300 dark:bg-gray-900 px-3.5 py-2">
      <MagnifyingGlassIcon className="h-4 w-4" />
      <Input
        type="search"
        placeholder="Search"
        className="w-full border-0 focus:!outline-none focus-visible:!ring-0 h-8 font-semibold"
      />
    </div>
  );
};

export default FeedSearch;