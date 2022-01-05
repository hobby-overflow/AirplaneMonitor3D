import path from 'path';
import { BrowserWindow, app, session, ipcMain } from 'electron';
const os = require('os');
import { searchDevtools } from 'electron-search-devtools';
import * as fs from 'fs';

const isDev = true;

// 開発モードの場合はホットリロードする
if (process.platform === 'win32') {
  require('electron-reload')(__dirname, {
    electron: path.resolve(
      __dirname,
      '../node_modules/electron/dist/electron.exe'
    ),
  });
}

if (process.platform === 'linux') {
  require('electron-reload')(__dirname, {
    electron: path.resolve(__dirname, '../node_modules/electron/dist/electron'),
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
      preload: path.resolve(__dirname, 'preload.js'),
    },
  });

  ipcMain.on('read_config', () => {
    let data = fs.readFileSync('./dist/config.json', 'utf-8');
    mainWindow.webContents.send('read_config', data);
    return;
  });

  // 開発モードの場合はデベロッパーツールを開く
  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }
  // レンダラープロセスをロード
  mainWindow.loadFile('dist/index.html');

  // if (process.env.WEBPACK_DEV_SERVER_URL) {
  //     await mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
  //     if (!process.env.IS_TEST) mainWindow.webContents.openDevTools();
  // }
}

app.whenReady().then(async () => {
  if (isDev) {
    const devtools = await searchDevtools('REACT');
    if (devtools) {
      await session.defaultSession.loadExtension(devtools, {
        allowFileAccess: true,
      });
    }
  }

  // BrowserWindow インスタンスを作成
  createWindow();
});

// すべてのウィンドウが閉じられたらアプリを終了する
app.once('window-all-closed', () => app.quit());
