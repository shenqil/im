import { IAboutWindow } from './about_window';
import { IHelpWindow } from './help_window';
import { IMainWindow } from './main_window';

export default interface IWins {
  about: IAboutWindow
  help: IHelpWindow
  main: IMainWindow
}
