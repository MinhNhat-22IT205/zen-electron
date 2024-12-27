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
import { Button } from "@/src/shared/components/shadcn-ui/button";
import { FileIcon } from "@radix-ui/react-icons";
import { Skeleton } from "@/src/shared/components/shadcn-ui/skeleton";

type props = {
  conversationId: string;
};

export default function FilesDialog({ conversationId }: props) {
  const [files, setFiles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getFiles = async () => {
    try {
      setIsLoading(true);
      const response = await http.get(
        `${CONVERSTAION_API_ENDPOINT}/${conversationId}/list-of-files?limit=100&skip=0`,
      );
      setFiles(response.data);
    } catch (error) {
      console.error("Failed to fetch files:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getFiles();
  }, [conversationId]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
        >
          <FileIcon className="w-4 h-4" />
          View Shared Files
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl bg-gradient-to-b from-amber-50/90 to-white backdrop-blur-sm border-amber-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-amber-800 mb-4">
            Shared Files
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[70vh] pr-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {isLoading ? (
              Array(6)
                .fill(0)
                .map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-40 w-full rounded-xl bg-amber-100/50"
                  />
                ))
            ) : files.length === 0 ? (
              <div className="col-span-full text-center py-8 text-amber-600">
                No files shared yet
              </div>
            ) : (
              files.map((file: any, index) => {
                const fileType = getFileType(file.content);
                return (
                  <div
                    key={index}
                    className="group relative rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105"
                  >
                    {fileType !== "image" ? (
                      <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                        <FileDisplay
                          filename={file.content.split(" ").pop()}
                          fileUrl={IMAGE_BASE_URL + file.content}
                        />
                      </div>
                    ) : (
                      <a
                        href={IMAGE_BASE_URL + file.content}
                        download
                        className="block relative group"
                      >
                        <img
                          src={IMAGE_BASE_URL + file.content}
                          className="w-full h-40 object-cover rounded-xl"
                          alt="file"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                          <span className="text-white text-sm">
                            Click to download
                          </span>
                        </div>
                      </a>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
