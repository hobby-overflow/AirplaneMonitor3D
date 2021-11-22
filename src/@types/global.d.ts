import { IpcRenderer } from "electron";

declare global {
    interface Window {
        requires: any
    }
}