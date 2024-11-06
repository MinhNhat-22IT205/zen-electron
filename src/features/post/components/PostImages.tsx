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
      {images.map((src, index) => {
        const isVideo = src.match(/\.(webm|mp4|mov|avi)$/i);
        return (
          <Dialog key={index}>
            <DialogTrigger asChild>
              {isVideo ? (
                <video
                  key={index}
                  src={IMAGE_BASE_URL + src}
                  className="w-full h-40 object-cover rounded-md cursor-pointer"
                  controls={false}
                  autoPlay={false}
                  muted={true}
                />
              ) : (
                <img
                  key={index}
                  src={IMAGE_BASE_URL + src}
                  alt={`Post Image ${index + 1}`}
                  className="w-full h-40 object-cover rounded-md"
                />
              )}
            </DialogTrigger>
            <DialogContent>
              {isVideo ? (
                <video
                  key={index}
                  src={IMAGE_BASE_URL + src}
                  className="w-full h-full object-cover rounded-md"
                  controls={true}
                />
              ) : (
                <img
                  key={index}
                  src={IMAGE_BASE_URL + src}
                  alt={`Post Image ${index + 1}`}
                  className="w-full h-full object-cover rounded-md"
                />
              )}
            </DialogContent>
          </Dialog>
        );
      })}
    </div>
  );
};

export default PostImages;
