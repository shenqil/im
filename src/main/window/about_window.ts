import BaseWIN, { IBaseWIN } from './base';

export interface IAboutWindow extends IBaseWIN {

}
export class AboutWindow extends BaseWIN implements IAboutWindow {
}

export default new AboutWindow('about_window');
