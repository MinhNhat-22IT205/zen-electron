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
import { usePomodoroStore } from "@/src/shared/libs/zustand/pomodoro-settings";

type SharePomodoroAsPostDialogProps = {
  isOpen: boolean;
  close: () => void;
  onChange: (isOpen: boolean) => void;
};

const SharePomodoroAsPostDialog = ({
  isOpen,
  onChange,
  close,
}: SharePomodoroAsPostDialogProps) => {
  const navigate = useNavigate();
  const {
    totalTimeSpent,
    sessionLength,
    breakLength,
    youtubeVideoId,
    youtubeVideoTitle,
  } = usePomodoroStore();

  const form = useForm<ztAddPostInputs>({
    resolver: zodResolver(zAddPostInputs),
    defaultValues: {
      title: "Productive Pomodoro session sharing",
      body: `I just completed a ${sessionLength}-minute Pomodoro session! 🎯 \nCompleted a total of ${Math.max(
        1,
        Math.floor(totalTimeSpent / 60),
      )} minutes today. Feeling super productive! \n🚀Listening to: ${
        youtubeVideoTitle ? youtubeVideoTitle : "Lofi Study Mix"
      } \n🎶How about you? You can try my settings to stay focused and achieve your goals! 🌟`,
      images: [],
    },
  });

  const onSubmit = async (values: ztAddPostInputs) => {
    let postfix = `<pomodoro>${JSON.stringify({
      sessionLength,
      breakLength,
      youtubeVideoId,
      youtubeVideoTitle,
    })}</pomodoro>`;
    await addPost({ ...values, body: values.body + postfix });
    navigate("/feeds");
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
                      placeholder="What's on your mind huh?..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-2 border rounded-md p-2">
              <div className="space-y-2 flex-1">
                <h4 className="text-sm font-medium">Pomodoro Settings Used:</h4>
                <ul className="text-sm text-muted-foreground">
                  <li>Session Length: {sessionLength} minutes</li>
                  <li>Break Length: {breakLength} minutes</li>
                  <li>YouTube Video: {youtubeVideoTitle}</li>
                </ul>
              </div>
              {/* <Button variant="ghost">Use settings</Button> */}
            </div>

            <Button className="w-full mt-4" type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SharePomodoroAsPostDialog;
