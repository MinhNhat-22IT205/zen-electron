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
      <DialogContent className="bg-white/95 backdrop-blur-sm border border-amber-200 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-amber-600">
            Edit Profile
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {previews && (
              <div className="flex justify-center mb-4">
                <div className="w-32 h-32 rounded-full border-4 border-amber-200 overflow-hidden">
                  <img
                    src={previews}
                    alt="Avatar Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
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
                      className="border-amber-200 focus:border-amber-400 file:bg-amber-500 file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 file:mr-4 file:hover:bg-amber-600 cursor-pointer"
                      onChange={(event) => {
                        const { file, displayUrl } = getImageDataObject(event);
                        setPreviews(displayUrl);
                        onChange(file);
                      }}
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Username"
                      {...field}
                      className="border-amber-200 focus:border-amber-400"
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage className="text-red-500" />
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
                      placeholder="Description..."
                      {...field}
                      className="border-amber-200 focus:border-amber-400 min-h-[100px]"
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <Button
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium"
              type="submit"
            >
              Save Changes
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
