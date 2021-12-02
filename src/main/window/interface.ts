import { IAboutWindow } from './about_window';
import { IHelpWindow } from './help_window';
import { IMainWindow } from './main_window';
import { ILoginWindow } from './login_window';
import { IAddFriendWindow } from './addFriend_window';
import { IBusinessCardWindow } from './businessCard_window';

export * from './businessCard_window';

export default interface IWins {
  about: IAboutWindow
  help: IHelpWindow
  main: IMainWindow
  login: ILoginWindow
  addFriend: IAddFriendWindow
  businessCard:IBusinessCardWindow
}
