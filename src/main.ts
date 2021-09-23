import { app, BrowserWindow, ipcMain } from 'electron';

import { joinDirname } from './main/utils/common';

// 引入所有自定义协议
import './main/schemes/index';
// 引入所有窗口
import wins from './main/window/index';
// 引入工具包

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      nativeWindowOpen: true,
      preload: joinDirname('./preload/preload.ts'),
    },
  });

  // and load the index.html of the app.
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    mainWindow.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}main_window.html`);
  } else {
    mainWindow.loadURL(joinDirname('./renderer/main_window.html'));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.on('synchronous-message', (event: any, arg) => {
  console.log(arg); // prints "ping"
  // eslint-disable-next-line no-param-reassign
  event.returnValue = 'pong';
});

ipcMain.on('openAboutWin', () => {
  wins.about.openWin()
});

ipcMain.on('openHelpWin', () => {
  wins['help'].openWin()
});
