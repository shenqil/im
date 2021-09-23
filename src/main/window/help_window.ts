import BaseWIN, { IBaseWIN } from './base'

export interface IHelpWindow extends IBaseWIN {

}

export class HelpWindow extends BaseWIN implements IHelpWindow {
  constructor(name: string) {
    super(name);
  }
}

export default new HelpWindow("help_window")
