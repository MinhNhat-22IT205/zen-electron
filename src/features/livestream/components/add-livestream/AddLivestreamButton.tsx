import React from "react";
import AddLivestreamDialog from "./AddLivestreamDialog";
import { useNavigate } from "react-router-dom";
import { Button } from "@/src/shared/components/shadcn-ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import { useDisclosure } from "@/src/shared/hooks/use-disclosure";

const AddLivestreamButton = () => {
  const { isOpen, close, open } = useDisclosure();
  return (
    <>
      <Button variant="ghost" onClick={() => open()}>
        <PlusIcon />
      </Button>
      <AddLivestreamDialog
        isOpen={isOpen}
        close={close}
        onChange={(isOpen) => {
          if (!isOpen) {
            close();
          } else {
            open();
          }
        }}
      />
    </>
  );
};

export default AddLivestreamButton;
