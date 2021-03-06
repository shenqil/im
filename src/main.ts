import { app, BrowserWindow } from 'electron';
// 引入窗口通讯
import './main/ipcMain/index';
// 引入所有自定义协议
import './main/schemes/index';
// 引入所有窗口
import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from 'electron-devtools-installer';
import wins from './main/window/index';
import { appReady } from './main/lifeCycle';
import '@main/utils/singleInstance';
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    try {
      await installExtension(REACT_DEVELOPER_TOOLS);
      await installExtension(REDUX_DEVTOOLS);
    } catch (e) {
      console.error('React Devtools failed to install:', e);
    }
  }
  await appReady();
  wins.login.openWin();
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
    wins.main.openWin();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
