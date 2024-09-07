import { Button } from "../../../shared/components/shadcn-ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import React from "react";

const AddFeedButton = () => {
  return (
    <Button className="bg-blue-600 text-white">
      <PlusIcon className="w-5 h-5" />
      Add Feed
    </Button>
  );
};

export default AddFeedButton;
