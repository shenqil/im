import mqtt from '../modules/mqtt/index';
import wins from '../window/index';

export interface IConnectSrv {
  login(username:string, password:string):Promise<unknown>
  signOut():Promise<unknown>
}

const connectSrv:IConnectSrv = {
  /**
   * 登录
   * */
  async login(username:string, password:string) {
    await mqtt.connect.login(username, password);
    wins.login.win?.hide();
    wins.main.openWin();
    wins.login.win?.close();
  },
  /**
   * 退出
   * */
  async signOut() {
    wins.main.win?.close();
    wins.login.openWin();
  },
};

export default connectSrv;
