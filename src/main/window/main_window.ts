import BaseWIN, { IBaseWIN } from './base'
import { BrowserWindowConstructorOptions } from 'electron';

export interface IMainWindow extends IBaseWIN {

}

export class MainWindow extends BaseWIN implements IMainWindow {
  constructor(name: string) {
    super(name);
  }

  openWin(options: BrowserWindowConstructorOptions | void) {
    let o = {
      width: 800,
      height: 600,
      maximizable: true,
      resizable: true
    }
    if (options) {
      o = Object.assign(o, options)
    }
    super.openWin(o)
  }
}

export default new MainWindow('main_window');
