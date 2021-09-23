import BaseWIN, { IBaseWIN } from './base'

export interface IMainWindow extends IBaseWIN {
  openWin(): void
}

export class MainWindow extends BaseWIN implements IMainWindow {
  constructor(name: string) {
    super(name);
  }

  openWin() {
    super.openWin({
      width: 800,
      height: 600,
      maximizable: true,
      resizable: true
    })
  }
}

export default new MainWindow("main_window")
