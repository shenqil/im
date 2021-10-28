import BaseWIN, { IBaseWIN } from './base';

export interface ILoginWindow extends IBaseWIN {

}

export class LoginWindow extends BaseWIN implements ILoginWindow {
  openWin() {
    super.openWin({
      width: 520,
      height: 580,
    });
  }
}

export default new LoginWindow('login_window');
