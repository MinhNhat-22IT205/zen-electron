import { Button } from "../../../../shared/components/shadcn-ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import React from "react";
import AddPostDialog from "./AddPostDialog";
import { useDisclosure } from "@/src/shared/hooks/use-disclosure";

const AddPostButton = () => {
  const { isOpen, open, close } = useDisclosure();
  return (
    <>
      <Button
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 
                   shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 
                   dark:shadow-blue-500/10 dark:hover:shadow-blue-500/20"
        onClick={open}
      >
        <PlusIcon className="w-5 h-5 mr-2" />
        Add Post
      </Button>
      <AddPostDialog
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

export default AddPostButton;
