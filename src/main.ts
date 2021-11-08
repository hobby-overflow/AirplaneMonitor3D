import path from "path";
import { BrowserWindow, app, session } from "electron";
const os = require("os");

// 開発モードの場合はホットリロードする
if (process.platform === "win32") {
    require("electron-reload")(__dirname, {
        electron: path.resolve(
            __dirname,
            "../node_modules/electron/dist/electron.exe"
        ),
    });
}

if (process.platform === "linux") {
    require("electron-reload")(__dirname, {
        electron: path.resolve(
            __dirname,
            "../node_modules/electron/dist/electron"
        ),
    });
}
// BrowserWindow インスタンスを作成する関数
async function createWindow() {
    const mainWindow = new BrowserWindow({
        autoHideMenuBar: true,
        width: 1280,
        height: 720,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            // preload: path.resolve(__dirname, "preload.js"),
        },
    });

    // 開発モードの場合はデベロッパーツールを開く
    mainWindow.webContents.openDevTools({ mode: "detach" });
    // レンダラープロセスをロード
    mainWindow.loadFile("dist/index.html");
    
    if (process.env.WEBPACK_DEV_SERVER_URL) {
        await mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
        if (!process.env.IS_TEST) mainWindow.webContents.openDevTools();
    }
};

const reactDevToolsPath = path.join(
    os.homedir(),
    "AppData/Local/Google/Chrome/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.21.0_0"
)
app.whenReady().then(async () => {
    // BrowserWindow インスタンスを作成
    createWindow();
    
    session.defaultSession.loadExtension(reactDevToolsPath,
        { allowFileAccess: true });
});

// すべてのウィンドウが閉じられたらアプリを終了する
app.once("window-all-closed", () => app.quit());
