import { BrowserWindowConstructorOptions } from 'electron';
import BaseWIN, { IBaseWIN } from './base';

export interface IMainWindow extends IBaseWIN {

}

export class MainWindow extends BaseWIN implements IMainWindow {
  openWin(options: BrowserWindowConstructorOptions | void) {
    let o = {
      width: 900,
      height: 600,
      maximizable: true,
      resizable: true,
    };
    if (options) {
      o = Object.assign(o, options);
    }
    super.openWin(o);
  }
}

export default new MainWindow('main_window');
