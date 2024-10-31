// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";

declare global {
  interface Window {
    electron: {
      getSources: () => Promise<any>;
    };
  }
}
contextBridge.exposeInMainWorld("electron", {
  getSources: () => ipcRenderer.invoke("GET_SCREEN_SHARE_SOURCES"),
});
