import BaseWIN, { IBaseWIN } from './base';
import mainWin from './main_window';
import { centerPoint } from './utils';

export interface IBusinessCardWindow extends IBaseWIN {

}
export class BusinessCardWindow extends BaseWIN implements IBusinessCardWindow {
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
  }
}

export default new BusinessCardWindow('businessCard_window');
