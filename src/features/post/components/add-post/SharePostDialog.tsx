import { Button } from "@/src/shared/components/shadcn-ui/button";
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
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zAddPostInputs, ztAddPostInputs } from "../../lib/add-feed.zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/src/shared/components/shadcn-ui/textarea";
import { getImageDataArray } from "@/src/shared/helpers/get-image-data";
import { addPost } from "../../api/post.api";
import { Post } from "@/src/shared/types/post.type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/components/shadcn-ui/select";
import useFetchYourGroups from "@/src/features/group/hooks/useFetchYourGroups";

type SharePostDialogProps = {
  isOpen: boolean;
  close: () => void;
  onChange: (isOpen: boolean) => void;
  post: Post;
};

const SharePostDialog = ({
  isOpen,
  onChange,
  close,
  post,
}: SharePostDialogProps) => {
  const navigate = useNavigate();
  const [previews, setPreviews] = useState<string[]>([]);
  const [previewType, setPreviewType] = useState<string[]>([]);
  const { groups } = useFetchYourGroups();

  const form = useForm<ztAddPostInputs>({
    resolver: zodResolver(zAddPostInputs),
    defaultValues: {
      title: post.title,
      body: post.body,
      images: post.images,
      fromEndUserId: post.endUserId,
      groupId: "",
    },
  });

  const onSubmit = async (values: ztAddPostInputs) => {
    await addPost(values);
    close();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sharing this post?</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="groupId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="To my Profile" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* <SelectItem value="">My Profile</SelectItem> */}
                        {groups.map((group) => (
                          <SelectItem key={group._id} value={group._id}>
                            To {group.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

export default SharePostDialog;
