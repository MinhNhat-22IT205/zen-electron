// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";
import { Message, MessageLocal } from "./shared/types/message.type";
import { EndUser } from "./shared/types/enduser.type";

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
      saveFile: (
        userSent: EndUser,
        userReceived: string,
        file: string,
        conversationId: string,
      ) => void;
      getFile: (filePath: string) => Promise<File>;
      getUserFiles: (userId: string) => Promise<File[]>;
      showNotification: (title: string, body: string, icon: string) => void;
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
  saveFile: (
    userSent: EndUser,
    userReceived: string,
    file: string,
    conversationId: string,
  ) =>
    ipcRenderer.invoke(
      "SAVE_FILE",
      userSent,
      userReceived,
      file,
      conversationId,
    ),
  getFile: (filePath: string) => ipcRenderer.invoke("GET_FILE", filePath),
  getUserFiles: (userId: string) =>
    ipcRenderer.invoke("GET_USER_FILES", userId),
  showNotification: (title: string, body: string, icon: string) =>
    ipcRenderer.invoke("SHOW_NOTIFICATION", title, body, icon),
});
