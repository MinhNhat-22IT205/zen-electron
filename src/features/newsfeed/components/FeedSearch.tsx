import { Input } from "../../../shared/components/shadcn-ui/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import React from "react";
import { useNavigate } from "react-router-dom";

const FeedSearch = () => {
  const navigate = useNavigate();
  return (
    <div className="relative flex items-center w-[320px] group">
      <div className="absolute left-3 pointer-events-none">
        <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
      </div>
      <Input
        type="search"
        placeholder="Search posts and users..."
        className="w-full pl-10 pr-4 h-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500
                   transition-all duration-200"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            navigate(`/search?t=user&q=${e.currentTarget.value}`);
          }
        }}
      />
    </div>
  );
};

export default FeedSearch;
