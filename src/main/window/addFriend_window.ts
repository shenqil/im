import BaseWIN, { IBaseWIN } from './base';
import mainWin from './main_window';
import { centerPoint } from './utils';

export interface IAddFriendWindow extends IBaseWIN {

}
export class AddFriendWindow extends BaseWIN implements IAddFriendWindow {
  openWin() {
    if (!mainWin.win) {
      return;
    }

    // 计算显示的位置
    const [x, y] = centerPoint(422, 180);

    super.openWin({
      show: false,
      width: 422,
      height: 180,
      resizable: false,
      frame: false,
      x,
      y,
      parent: mainWin.win || undefined,
    });

    this.win?.once('ready-to-show', () => {
      this.win?.show();
      this.win?.once('blur', () => {
        this.closeWin();
      });
    });

    this.win?.once('close', () => {
      mainWin.win?.focus();
    });
  }
}

export default new AddFriendWindow('addFriend_window');
