import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/components/shadcn-ui/dialog";
import http from "@/src/shared/libs/axios/axios.base";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { CONVERSTAION_API_ENDPOINT } from "../../api/chat-endpoints.api";
import FileDisplay from "@/src/shared/components/FileDisplay";
import { useState, useEffect } from "react";
import { IMAGE_BASE_URL } from "@/src/shared/constants/base-paths";
import { getFileType } from "@/src/shared/helpers/get-file-type";
import { ScrollArea } from "@/src/shared/components/shadcn-ui/scroll-area";

type props = {
  conversationId: string;
};

export default function FilesDialog(props: props) {
  const [files, setFiles] = useState<string[]>([]);
  const getFiles = async () => {
    const files = await http.get(
      `${CONVERSTAION_API_ENDPOINT}/${props.conversationId}/list-of-files?limit=100&skip=0`,
    );
    setFiles(files.data);
  };

  useEffect(() => {
    getFiles();
  }, []);

  return (
    <Dialog>
      <DialogTrigger>See files sent</DialogTrigger>
      <DialogContent>
        <ScrollArea className="h-[90vh] [&>*]:mb-2">
          {files.map((file: any) => {
            const fileType = getFileType(file.content);
            return fileType !== "image" ? (
              <FileDisplay
                filename={file.content.split(" ").pop()}
                fileUrl={IMAGE_BASE_URL + file.content}
              />
            ) : (
              <a href={IMAGE_BASE_URL + file.content} download>
                <img
                  src={IMAGE_BASE_URL + file.content}
                  className="w-40 h-40"
                  alt="file"
                />
              </a>
            );
          })}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
