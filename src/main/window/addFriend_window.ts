import BaseWIN, { IBaseWIN } from './base';
import mainWin from './main_window';

export interface IAddFriendWindow extends IBaseWIN {

}
export class AddFriendWindow extends BaseWIN implements IAddFriendWindow {
  openWin() {
    if (!mainWin.win) {
      return;
    }

    // 计算显示的位置
    const [mX, mY] = mainWin.win.getPosition();
    const [mW, mH] = mainWin.win.getSize();
    const x = mX + (mW - 422) / 2;
    const y = mY + (mH - 180) / 2;

    super.openWin({
      show: false,
      width: 422,
      height: 180,
      resizable: false,
      frame: false,
      x: Math.floor(x),
      y: Math.floor(y),
      parent: mainWin.win || undefined,
    });

    this.win?.once('ready-to-show', () => {
      this.win?.show();
      this.win?.once('blur', () => {
        this.closeWin();
      });
    });
  }
}

export default new AddFriendWindow('addFriend_window');
