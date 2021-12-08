import { IAboutWindow } from './about_window';
import { IHelpWindow } from './help_window';
import { IMainWindow } from './main_window';
import { ILoginWindow } from './login_window';
import { IModalWindow } from './modal_window';

export * from './modal_window';

export default interface IWins {
  about: IAboutWindow
  help: IHelpWindow
  main: IMainWindow
  login: ILoginWindow
  modal: IModalWindow
}
