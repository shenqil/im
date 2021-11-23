import IServer from '../server/interface';
import IWins from '../window/interface';

export default interface IMainBridge {
  server:IServer
  wins:IWins
}
