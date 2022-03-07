import { app } from 'electron';
import ipcEvent from '@main/ipcMain/event';
import EMainEventKey from '@main/ipcMain/eventInterface';
import wins from '@main/window/index';

let isLogin = false;

ipcEvent.on(EMainEventKey.loginStatus, (status:boolean) => {
  isLogin = status;
});

//= ===============单例进程================
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.exit();
} else {
  app.on('second-instance', () => {
    // 当运行第二个实例时,将会聚焦到win这个窗口
    if (isLogin) {
      wins.main.win?.setSkipTaskbar(false);
      wins.main.win?.show();
      wins.main.win?.restore();
      wins.main.win?.focus();
    } else {
      wins.login.win?.setSkipTaskbar(false);
      wins.login.win?.show();
      wins.login.win?.restore();
      wins.login.win?.focus();
    }
  });
}
