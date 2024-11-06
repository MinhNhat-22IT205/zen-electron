export const getFileType = (filename: string) => {
  const extension = filename.split(".").pop()?.toLowerCase();
  if (["png", "jpg", "jpeg", "gif", "bmp"].includes(extension)) return "image";
  if (["mp4", "webm", "ogg"].includes(extension)) return "video";
  if (["mp3", "wav", "ogg"].includes(extension)) return "audio";
  if (["pdf"].includes(extension)) return "pdf";
  if (["txt", "doc", "docx", "xls", "xlsx"].includes(extension))
    return "document";
  if (["zip", "rar", "7z"].includes(extension)) return "compressed";
  return "other";
};
