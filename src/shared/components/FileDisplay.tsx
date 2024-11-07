import { useState, useEffect } from "react";
import { Card } from "./shadcn-ui/card";
import { CardContent } from "./shadcn-ui/card";
import { Button } from "./shadcn-ui/button";
import {
  ImageIcon,
  VideoIcon,
  FileIcon,
  FileTextIcon,
  ArchiveIcon,
  QuestionMarkCircledIcon,
  DownloadIcon,
} from "@radix-ui/react-icons";
import { getFileType } from "../helpers/get-file-type";

interface FileDisplayProps {
  filename: string;
  fileUrl: string;
}

export default function FileDisplay({ filename, fileUrl }: FileDisplayProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileType = getFileType(filename);

  const FileTypeIcon = () => {
    switch (fileType) {
      case "image":
        return <ImageIcon className="h-6 w-6" />;
      case "video":
        return <VideoIcon className="h-6 w-6" />;
      case "audio":
        return <VideoIcon className="h-6 w-6" />;
      case "pdf":
        return <FileTextIcon className="h-6 w-6" />;
      case "document":
        return <FileIcon className="h-6 w-6" />;
      case "compressed":
        return <ArchiveIcon className="h-6 w-6" />;
      default:
        return <QuestionMarkCircledIcon className="h-6 w-6" />;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden">
      <CardContent className="p-6  h-full flex flex-col justify-center">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 ">
          <div className="flex items-center w-full sm:w-auto overflow-hidden">
            <FileTypeIcon />
            <h3 className="ml-2 text-lg font-semibold truncate min-w-0">
              {filename}
            </h3>
          </div>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="w-full sm:w-auto shrink-0"
          >
            <a
              href={fileUrl}
              download={filename}
              className="flex items-center justify-center"
            >
              <DownloadIcon className="h-4 w-4" />
            </a>
          </Button>
        </div>

        {/* {loading ? (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Loading preview...</p>
          </div>
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : (
          <div className="space-y-4">
            {fileType === "image" && (
              <img
                src={fileUrl}
                alt={filename}
                className="w-full h-auto rounded-lg shadow-md"
              />
            )}
            {fileType === "video" && (
              <video controls className="w-full rounded-lg shadow-md">
                <source
                  src={fileUrl}
                  type={`video/${filename.split(".").pop()}`}
                />
                Your browser does not support the video tag.
              </video>
            )}
            {fileType === "audio" && (
              <audio controls className="w-full">
                <source
                  src={fileUrl}
                  type={`audio/${filename.split(".").pop()}`}
                />
                Your browser does not support the audio tag.
              </audio>
            )}
            {fileType === "pdf" && (
              <embed
                src={fileUrl}
                width="100%"
                height="500px"
                type="application/pdf"
              />
            )}
            {["document", "compressed", "other"].includes(fileType) && (
              <div className="flex justify-center items-center p-8 bg-muted rounded-lg">
                <FileTypeIcon />
                <span className="ml-2 text-lg font-medium">{filename}</span>
              </div>
            )}
          </div>
        )} */}
      </CardContent>
    </Card>
  );
}
