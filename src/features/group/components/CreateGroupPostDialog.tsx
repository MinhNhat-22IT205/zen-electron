import { Button } from "@/src/shared/components/shadcn-ui/button";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ztAddGroupPostInputs } from "../libs/add-group-post.zod";
import { zAddGroupPostInputs } from "../libs/add-group-post.zod";
import { addGroupPost } from "../api/group-post.api";
import { useParams } from "react-router-dom";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/components/shadcn-ui/dialog";
import { PlusIcon } from "@radix-ui/react-icons";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/src/shared/components/shadcn-ui/form";
import { Input } from "@/src/shared/components/shadcn-ui/input";
import { Textarea } from "@/src/shared/components/shadcn-ui/textarea";
import { Label } from "@/src/shared/components/shadcn-ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/src/shared/components/shadcn-ui/radio-group";
import {
  getImageDataArray,
  getImageDataObject,
} from "@/src/shared/helpers/get-image-data";

const CreateGroupPostDialog = () => {
  const { id: groupId } = useParams();
  const [previews, setPreviews] = useState<string[]>([]);

  const form = useForm<ztAddGroupPostInputs>({
    resolver: zodResolver(zAddGroupPostInputs),
    defaultValues: {
      title: "",
      body: "",
      groupId: groupId,
      images: [],
    },
  });

  const onSubmit = async (values: ztAddGroupPostInputs) => {
    await addGroupPost(values);
    form.reset();
    const dialogTrigger = document.querySelector("[data-state='open']");
    if (dialogTrigger instanceof HTMLButtonElement) {
      dialogTrigger.click();
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="ml-auto">Create Post</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Group</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Post Title" {...field} />
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
                    <Textarea placeholder="Post Body..." {...field} />
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
                  {previews.map((src: string, index: number) => (
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
            <Button className="w-full mt-4" type="submit">
              Create Post
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupPostDialog;
