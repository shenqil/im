import { BrowserWindow, ipcMain } from 'electron';
import { joinDirname } from '../utils/common';

let loginWindow: BrowserWindow;
const createWindow = (): void => {
  if (loginWindow) {
    return;
  }
  // Create the browser window.
  loginWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      nativeWindowOpen: true,
    },
  });

  // and load the index.html of the app.
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    loginWindow.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}login_window.html`);
  } else {
    loginWindow.loadURL(joinDirname('./renderer/login_window.html'));
  }

  // Open the DevTools.
  loginWindow.webContents.openDevTools();
};

ipcMain.on('openLoginWindow', () => {
  createWindow();
});
