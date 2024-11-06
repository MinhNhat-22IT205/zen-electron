import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "@/src/shared/components/shadcn-ui/textarea";
import { getImageDataArray } from "@/src/shared/helpers/get-image-data";
import { addPost } from "@/src/features/post/api/post.api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/components/shadcn-ui/select";
import { addGroupPost } from "../../group/api/group-post.api";
import {
  zAddGroupPostInputs,
  ztAddGroupPostInputs,
} from "../../group/libs/add-group-post.zod";
import useFetchYourGroups from "../../group/hooks/useFetchYourGroups";
import { DropdownMenuItem } from "@/src/shared/components/shadcn-ui/dropdown";
import { useDisclosure } from "@/src/shared/hooks/use-disclosure";

type AddPostAfterRecordingDialogProps = {
  videoData: {
    url: string;
    filename: string;
    recordedBlob: Blob;
  };
};

const AddPostAfterRecordingDialog = ({
  videoData,
}: AddPostAfterRecordingDialogProps) => {
  const navigate = useNavigate();
  const { groups } = useFetchYourGroups();
  const [previews, setPreviews] = useState<string[]>([videoData.url]);
  const [isOpen, setIsOpen] = useState(false);
  const createTransferableFile = (): FileList => {
    const file = new File([videoData.recordedBlob], videoData.filename, {
      type: "video/webm",
    });
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    return dataTransfer.files;
  };
  const form = useForm<ztAddGroupPostInputs>({
    resolver: zodResolver(zAddGroupPostInputs),
    defaultValues: {
      title: "",
      body: "",
      groupId: "",
      images: Array.from(createTransferableFile()),
    },
  });

  const onSubmit = async (values: ztAddGroupPostInputs) => {
    await addGroupPost(values);
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => {
            // prevent the dropdown from closing
            e.preventDefault();
            setIsOpen(true);
          }}
        >
          Post the recording
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
              name="groupId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="My Profile" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* <SelectItem value="">My Profile</SelectItem> */}
                        {groups.map((group) => (
                          <SelectItem key={group._id} value={group._id}>
                            {group.name}
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
            {previews.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-900">
                  Image Previews
                </h3>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {previews.map((src, index) => (
                    <div key={index} className="relative">
                      <video
                        src={src}
                        className="w-full h-full object-cover rounded"
                        controls
                        autoPlay={false}
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

export default AddPostAfterRecordingDialog;
