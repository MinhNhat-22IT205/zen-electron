import FileDisplay from "@/src/shared/components/FileDisplay";
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
    <div
      className={`grid ${images.length === 1 ? "grid-cols-1" : "grid-cols-2"} gap-2`}
    >
      {images.map((src, index) => {
        const fileName = src.split(" ").pop();
        const isImage = src.match(/\.(jpg|jpeg|png|gif|bmp|tiff|webp)$/i);
        const isVideo = src.match(/\.(webm|mp4|mov|avi)$/i);
        if (!isImage && !isVideo)
          return (
            <FileDisplay filename={fileName} fileUrl={IMAGE_BASE_URL + src} />
          );
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
