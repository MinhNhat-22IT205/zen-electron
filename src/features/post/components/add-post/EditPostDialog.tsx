import { Button } from "@/src/shared/components/shadcn-ui/button";
import {
  Dialog,
  DialogContent,
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
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zAddPostInputs, ztAddPostInputs } from "../../lib/add-feed.zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/src/shared/components/shadcn-ui/textarea";
import { getImageDataArray } from "@/src/shared/helpers/get-image-data";
import { addPost, editPost } from "../../api/post.api";
import { Post } from "@/src/shared/types/post.type";
import { DropdownMenuItem } from "@/src/shared/components/shadcn-ui/dropdown";
import { useDisclosure } from "@/src/shared/hooks/use-disclosure";

type AddPostDialogProps = {
  currentPost: Post;
};

const EditPostDialogMenuItem = ({ currentPost }: AddPostDialogProps) => {
  const navigate = useNavigate();
  const [previews, setPreviews] = useState<string[]>([]);
  const { isOpen, close, open, toggle } = useDisclosure();
  const [previewType, setPreviewType] = useState<string[]>([]);

  const form = useForm<ztAddPostInputs>({
    resolver: zodResolver(zAddPostInputs),
    defaultValues: {
      title: currentPost.title,
      body: currentPost.body,
      images: currentPost.images,
    },
  });

  const onSubmit = async (values: ztAddPostInputs) => {
    await editPost(currentPost._id, values);
    close();
  };

  return (
    <Dialog open={isOpen} onOpenChange={toggle}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            open();
          }}
        >
          Edit post
        </DropdownMenuItem>
      </DialogTrigger>
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
                      placeholder="What's on your mind huh?..."
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
                          "displayUrls",
                          Array.from(files).map((file) => file.type),
                        );
                        setPreviewType(
                          Array.from(files).map((file) => file.type),
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
            {previews.length > 0 &&
              previewType.some((type) => type.startsWith("image")) && (
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
            <Button className="w-full mt-4" type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPostDialogMenuItem;
