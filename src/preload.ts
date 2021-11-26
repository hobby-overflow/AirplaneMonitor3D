import { contextBridge, ipcRenderer} from 'electron'

contextBridge.exposeInMainWorld(
    "api", {
        send: (channel: string, arg: string) => {
            ipcRenderer.send(channel, arg)
        },
        on: (channel: string, func: Function) => {
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    }
)