// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";
import { Message, MessageLocal } from "./shared/types/message.type";

declare global {
  interface Window {
    electron: {
      getSources: () => Promise<any>;
    };
    api: {
      saveMessage: (userId: string, message: Message) => void;
      getMessages: (
        userId: string,
        conversationId: string,
      ) => Promise<MessageLocal[]>;
      saveFile: (userId: string, file: File, filename: string) => void;
      getFile: (filePath: string) => Promise<File>;
      getUserFiles: (userId: string) => Promise<File[]>;
    };
  }
}
contextBridge.exposeInMainWorld("electron", {
  getSources: () => ipcRenderer.invoke("GET_SCREEN_SHARE_SOURCES"),
});

contextBridge.exposeInMainWorld("api", {
  saveMessage: (userId: string, message: any) =>
    ipcRenderer.invoke("SAVE_MESSAGE", userId, message),
  getMessages: (userId: string, conversationId: string) =>
    ipcRenderer.invoke("GET_MESSAGES", userId, conversationId),
  saveFile: (userId: string, file: Buffer, filename: string) =>
    ipcRenderer.invoke("SAVE_FILE", userId, file, filename),
  getFile: (filePath: string) => ipcRenderer.invoke("GET_FILE", filePath),
  getUserFiles: (userId: string) =>
    ipcRenderer.invoke("GET_USER_FILES", userId),
});
