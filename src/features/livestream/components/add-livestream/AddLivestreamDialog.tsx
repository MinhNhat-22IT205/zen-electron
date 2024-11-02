import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  zAddLivestreamInputs,
  ztAddLivestreamInputs,
} from "../../libs/add-livestream.zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLivestream } from "../../api/livestream.api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/components/shadcn-ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/src/shared/components/shadcn-ui/form";
import { Input } from "@/src/shared/components/shadcn-ui/input";
import { Textarea } from "@/src/shared/components/shadcn-ui/textarea";
import { Button } from "@/src/shared/components/shadcn-ui/button";

type AddLivestreamDialogProps = {
  isOpen: boolean;
  close: () => void;
  onChange: (isOpen: boolean) => void;
};

const AddLivestreamDialog = ({
  isOpen,
  onChange,
  close,
}: AddLivestreamDialogProps) => {
  const navigate = useNavigate();

  const form = useForm<ztAddLivestreamInputs>({
    resolver: zodResolver(zAddLivestreamInputs),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = async (values: ztAddLivestreamInputs) => {
    const livestream = await createLivestream(values);
    navigate(`/livestream/${livestream._id}`);
    close();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Start a livestream</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Title" {...field} />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Give a short description of your livestream.."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full mt-4" type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLivestreamDialog;
