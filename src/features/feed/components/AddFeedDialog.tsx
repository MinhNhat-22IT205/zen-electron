import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/shared/components/shadcn-ui/avatar";
import { Button } from "@/src/shared/components/shadcn-ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { EndUser } from "@/src/shared/types/enduser.type";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zAddPostInputs, ztAddPostInputs } from "../lib/add-feed.zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/src/shared/components/shadcn-ui/textarea";
import { getImageDataArray } from "@/src/shared/helpers/get-image-data";
import { addFeed } from "../api/feed.api";

type AddFeedDialogProps = {
  isOpen: boolean;
  close: () => void;
  onChange: (isOpen: boolean) => void;
};
const AddFeedDialog = ({ isOpen, onChange, close }: AddFeedDialogProps) => {
  const navigate = useNavigate();
  const [previews, setPreviews] = useState<string[]>([]);

  const form = useForm<ztAddPostInputs>({
    resolver: zodResolver(zAddPostInputs),
    defaultValues: {
      title: "",
      body: "",
      images: [],
    },
  });

  const onSubmit = async (values: ztAddPostInputs) => {
    await addFeed(values);
    close();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a post</DialogTitle>
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
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="what is in your mind huh?..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="images"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="file"
                      multiple
                      {...rest}
                      onChange={(event) => {
                        const { files, displayUrls } = getImageDataArray(event);
                        setPreviews(displayUrls);
                        console.log(
                          "files",
                          files,
                          typeof files,
                          Array.from(files),
                        );
                        onChange(Array.from(files));
                      }}
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            {previews.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-900">
                  Image Previews
                </h3>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {previews.map((src, index) => (
                    <div key={index} className="relative">
                      <img
                        src={src}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <Button className="w-full" variant={"default"} type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFeedDialog;
