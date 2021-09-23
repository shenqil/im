import BaseWIN, { IBaseWIN } from './base'

export interface IAboutWindow extends IBaseWIN {

}
export class AboutWindow extends BaseWIN implements IAboutWindow {
  constructor(name: string) {
    super(name);
  }
}

export default new AboutWindow("about_window")

