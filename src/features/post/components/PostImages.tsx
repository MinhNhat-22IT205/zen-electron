import {
  DialogContent,
  DialogTrigger,
} from "@/src/shared/components/shadcn-ui/dialog";
import { IMAGE_BASE_URL } from "@/src/shared/constants/base-paths";
import { useDisclosure } from "@/src/shared/hooks/use-disclosure";
import { Dialog } from "@radix-ui/react-dialog";
import React from "react";

type PostImagesProps = {
  images: string[];
};
const PostImages = ({ images }: PostImagesProps) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {images.map((src, index) => (
        <>
          <Dialog>
            <DialogTrigger asChild>
              <img
                key={index}
                src={IMAGE_BASE_URL + src}
                alt={`Post Image ${index + 1}`}
                className="w-full h-40 object-cover rounded-md"
              />
            </DialogTrigger>
            <DialogContent>
              <img
                key={index}
                src={IMAGE_BASE_URL + src}
                alt={`Post Image ${index + 1}`}
                className="w-full h-full object-cover rounded-md"
              />
            </DialogContent>
          </Dialog>
        </>
      ))}
    </div>
  );
};

export default PostImages;
