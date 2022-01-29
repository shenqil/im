import ipcEvent from '@main/ipcMain/event';
import EMainEventKey from '@main/ipcMain/eventInterface';
import BaseWIN, { IBaseWIN } from './base';

export interface ILoginWindow extends IBaseWIN {

}

export class LoginWindow extends BaseWIN implements ILoginWindow {
  private appQuit:boolean;

  constructor(name:string) {
    super(name);
    this.appQuit = false;
    ipcEvent.on(EMainEventKey.appQuit, () => {
      this.appQuit = true;
    });
  }

  openWin() {
    const win = super.openWin({
      width: 520,
      height: 580,
    });

    if (win) {
      win.on('close', (e) => {
        if (!this.appQuit) {
          // 不是整个应用退出则隐藏窗口即可
          if (win.isVisible()) {
            e.preventDefault();
            win.hide();
          }
        }
      });
    }

    return win;
  }
}

export default new LoginWindow('login_window');
