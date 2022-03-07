import { BrowserWindowConstructorOptions } from 'electron';
import ipcEvent from '@main/ipcMain/event';
import EMainEventKey from '@main/ipcMain/eventInterface';
import BaseWIN, { IBaseWIN } from './base';

export interface IMainWindow extends IBaseWIN {

}

export class MainWindow extends BaseWIN implements IMainWindow {
  private appQuit:boolean;

  constructor(name:string) {
    super(name);
    this.appQuit = false;
    ipcEvent.on(EMainEventKey.appQuit, () => {
      this.appQuit = true;
    });
  }

  openWin(options: BrowserWindowConstructorOptions | void) {
    let o = {
      width: 900,
      height: 600,
      maximizable: true,
      resizable: true,
      backgroundColor: '#f5ff5f5',
    };
    if (options) {
      o = Object.assign(o, options);
    }
    const win = super.openWin(o);
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

export default new MainWindow('main_window');
