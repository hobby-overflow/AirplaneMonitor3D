import { contextBridge, ipcRenderer } from "electron"

contextBridge.exposeInMainWorld(
    'requires', {
        imageCache: require("image-cache"),
})