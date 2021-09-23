import BaseWIN, { IBaseWIN } from './base'

export interface ILoginWindow extends IBaseWIN {

}

export class LoginWindow extends BaseWIN implements ILoginWindow {
  constructor(name: string) {
    super(name);
  }
}

export default new LoginWindow("login_window")
