import { Button } from "../../../shared/components/shadcn-ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import React from "react";
import AddFeedDialog from "./AddFeedDialog";
import { useDisclosure } from "@/src/shared/hooks/use-disclosure";

const AddFeedButton = () => {
  const { isOpen, open, close } = useDisclosure();
  return (
    <>
      <Button className="bg-blue-600 text-white" onClick={open}>
        <PlusIcon className="w-5 h-5" />
        Add Feed
      </Button>
      <AddFeedDialog
        isOpen={isOpen}
        onChange={(isOpen) => {
          if (!isOpen) {
            close();
          } else {
            open();
          }
        }}
        close={close}
      />
    </>
  );
};

export default AddFeedButton;
