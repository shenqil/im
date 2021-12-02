import IServer from '../server/interface';
import IWins from '../window/interface';
import IMenu from '../menu/interface';

export default interface IMainBridge {
  server:IServer
  wins:IWins
  menu:IMenu
}
