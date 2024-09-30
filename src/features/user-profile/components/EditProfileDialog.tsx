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
import { Textarea } from "@/src/shared/components/shadcn-ui/textarea";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  zEditProfileInputs,
  ztEditProfileInputs,
} from "../lib/edit-profile.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "react-router-dom";
import { editProfileInfo } from "../api/profile.api";
import { getImageDataObject } from "@/src/shared/helpers/get-image-data";
import { useAuthStore } from "@/src/shared/libs/zustand/auth.zustand";

type EditProfileDialogProps = {
  isOpen: boolean;
  onChange: (isOpen: boolean) => void;
  close: () => void;
};
const EditProfileDialog = ({
  isOpen,
  onChange,
  close,
}: EditProfileDialogProps) => {
  const { id } = useParams();
  const [previews, setPreviews] = useState<string>("");
  const authStore = useAuthStore((state) => state);

  const form = useForm<ztEditProfileInputs>({
    resolver: zodResolver(zEditProfileInputs),
    defaultValues: {
      username: authStore.endUser.username,
      description: authStore.endUser.description,
      avatar: "",
    },
  });

  const onSubmit = async (values: ztEditProfileInputs) => {
    const result = await editProfileInfo(values);
    authStore.setEndUser({
      ...authStore.endUser,
      username: values.username,
      description: values.description,
      avatar: result.avatar,
    });
    close();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {previews && (
              <div className="mb-4 mx-auto">
                <img
                  src={previews}
                  alt="Avatar Preview"
                  className="w-32 h-32 rounded-full object-cover"
                />
              </div>
            )}
            <FormField
              control={form.control}
              name="avatar"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="file"
                      {...rest}
                      onChange={(event) => {
                        const { file, displayUrl } = getImageDataObject(event);
                        setPreviews(displayUrl);

                        onChange(file);
                      }}
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
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
                    <Textarea placeholder="Description.." {...field} />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" variant={"default"} type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
