import BaseWIN, { IBaseWIN } from './base';

export interface IHelpWindow extends IBaseWIN {

}

export class HelpWindow extends BaseWIN implements IHelpWindow {
}

export default new HelpWindow('help_window');
