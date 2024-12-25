import { Input } from "@/src/shared/components/shadcn-ui/input";
import { Button } from "@/src/shared/components/shadcn-ui/button";
import { MagnifyingGlassIcon, ArrowLeftIcon } from "@radix-ui/react-icons";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import EnduserSearchList from "./EnduserSearchList";

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q");

  return (
    <div className="max-w-2xl mx-auto space-y-4 mt-10">
      <div className="flex gap-2">
        {searchQuery && (
          <Button
            variant="ghost"
            className="h-12 w-12 rounded-xl hover:bg-amber-100"
            onClick={() => navigate("/conversations")}
          >
            <ArrowLeftIcon className="h-5 w-5 text-amber-600" />
          </Button>
        )}
        <div className="relative group flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-amber-400 group-hover:text-amber-600 transition-colors duration-300" />
          </div>
          <Input
            type="search"
            placeholder="Search users..."
            defaultValue={searchQuery}
            className="w-full pl-10 h-12 bg-gradient-to-r from-amber-50 to-white border-2 border-amber-200 
              focus:border-amber-400 focus:ring-2 focus:ring-amber-200 rounded-xl
              transition-all duration-300 ease-in-out
              placeholder:text-amber-300
              hover:shadow-lg hover:shadow-amber-100
              focus:shadow-xl focus:shadow-amber-100
              hover:scale-[1.02] focus:scale-[1.02]"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                navigate(`/search?q=${e.currentTarget.value}`);
              }
            }}
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-amber-200/20 to-transparent rounded-xl 
            opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
          />
        </div>
      </div>
      <EnduserSearchList searchQuery={searchQuery} />
    </div>
  );
};

export default SearchPage;
