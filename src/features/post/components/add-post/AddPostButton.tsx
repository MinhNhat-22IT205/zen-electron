import { Button } from "../../../../shared/components/shadcn-ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import React from "react";
import AddPostDialog from "./AddPostDialog";
import { useDisclosure } from "@/src/shared/hooks/use-disclosure";

const AddPostButton = () => {
  const { isOpen, open, close } = useDisclosure();
  return (
    <>
      <Button className="bg-blue-600 text-white" onClick={open}>
        <PlusIcon className="w-5 h-5" />
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
